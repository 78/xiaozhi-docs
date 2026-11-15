import { readFile, writeFile, mkdir, copyFile, access, rm } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { homedir } from 'node:os'
import { resolve, extname, join } from 'node:path'
import sharp from 'sharp'
import { readPages, locales } from './content.mjs'

const root = resolve(import.meta.dirname, '..')
const cache = process.env.XIAOZHI_IMAGE_CACHE || join(homedir(), '.cache/xiaozhi-docs-image-optimization')
const apply = process.argv.includes('--apply')
const json = async path => JSON.parse(await readFile(resolve(root, path), 'utf8'))
const save = async (path, value) => writeFile(resolve(root, path), JSON.stringify(value, null, 2) + '\n')
const sha = buffer => createHash('sha256').update(buffer).digest('hex')
const policy = await json('audit/image-policy.json')
let prior
try { prior = await json('audit/image-optimization.json') } catch { /* First run. */ }
await mkdir(join(cache, 'originals'), { recursive: true })
await mkdir(join(cache, 'candidates'), { recursive: true })
sharp.concurrency(2)

async function visiblePixelsEqual(input, output) {
  const decode = value => sharp(value).autoOrient().ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const [before, after] = await Promise.all([decode(input), decode(output)])
  if (before.info.width !== after.info.width || before.info.height !== after.info.height) return false
  for (let offset = 0; offset < before.data.length; offset += 4) {
    if (before.data[offset + 3] !== after.data[offset + 3]) return false
    // Invisible RGB is immaterial; nonzero-alpha pixels and alpha must be identical.
    if (before.data[offset + 3] && (before.data[offset] !== after.data[offset] || before.data[offset + 1] !== after.data[offset + 1] || before.data[offset + 2] !== after.data[offset + 2])) return false
  }
  return true
}

async function optimize(item) {
  const previous = prior?.items.find(entry => entry.source.path === item.sourcePath)
  let original = resolve(root, item.sourcePath)
  if (previous) original = join(cache, 'originals', previous.source.sha256 + extname(previous.source.path))
  try { await access(original) } catch {
    throw new Error(`Original unavailable: ${item.sourcePath}. Restore its recorded SHA-256 original to the external image cache; never re-encode an optimized derivative.`)
  }
  const input = await readFile(original)
  const sourceHash = sha(input)
  if (previous && sourceHash !== previous.source.sha256) throw new Error(`Original changed: ${item.sourcePath}`)
  const archived = join(cache, 'originals', sourceHash + extname(item.sourcePath))
  if (original !== archived) await copyFile(original, archived)
  const metadata = await sharp(input).metadata()
  if ((metadata.pages || 1) > 1) throw new Error(`Animated image requires an explicit policy: ${item.sourcePath}`)
  const profile = policy.profiles[item.profile]
  const pipeline = (edge = profile.maxLongEdge) => {
    let operation = sharp(input).autoOrient()
    if (edge) operation = operation.resize({ width: edge, height: edge, fit: 'inside', withoutEnlargement: true })
    return operation
  }
  const candidates = []
  const opaque = !metadata.hasAlpha || (await sharp(input).stats()).isOpaque
  if (profile.lossless) {
    candidates.push({ format: 'webp', method: 'lossless', data: await pipeline().webp({ lossless: true, exact: true, effort: 6 }).toBuffer() })
    candidates.push({ format: 'png', method: 'lossless', data: await pipeline().png({ compressionLevel: 9, adaptiveFiltering: true }).toBuffer() })
  } else {
    // Preserve the preferred size/quality when possible. Noisy camera photos can use
    // a reviewed quality floor or smaller edge, rather than breaking the byte budget.
    const edges = [...new Set([profile.maxLongEdge, Math.min(profile.maxLongEdge, 1800), 1600])]
    const qualities = [...new Set([profile.quality, Math.min(profile.quality, 86), 82, 80])]
    let fitted = false
    for (const edge of edges) {
      for (const quality of qualities) {
        candidates.push({ format: 'webp', method: 'lossy', quality, edge, data: await pipeline(edge).webp({ quality, alphaQuality: 100, smartSubsample: true, effort: 6 }).toBuffer() })
        if (opaque) candidates.push({ format: 'jpeg', method: 'lossy', quality, edge, data: await pipeline(edge).jpeg({ quality, mozjpeg: true, progressive: true, chromaSubsampling: '4:4:4' }).toBuffer() })
        if (candidates.some(candidate => candidate.data.length <= profile.maxBytes)) { fitted = true; break }
      }
      if (fitted) break
    }
  }
  // Already-small, metadata-free images should not grow merely to change their suffix.
  const noMetadata = !metadata.exif && !metadata.icc && !metadata.xmp && !metadata.iptc && !metadata.orientation && !metadata.comments?.length
  const displaySize = metadata.autoOrient || metadata
  const withinDimensions = !profile.maxLongEdge || Math.max(displaySize.width, displaySize.height) <= profile.maxLongEdge
  if (noMetadata && withinDimensions) candidates.push({ format: metadata.format, method: 'unchanged', data: input })
  const eligible = candidates.filter(candidate => candidate.data.length <= profile.maxBytes)
  eligible.sort((a, b) => a.data.length - b.data.length)
  const selected = eligible[0] || candidates.reduce((a, b) => a.data.length < b.data.length ? a : b)
  const outputMeta = await sharp(selected.data).metadata()
  const exactPixels = profile.lossless ? await visiblePixelsEqual(input, selected.data) : null
  if (profile.lossless && !exactPixels) throw new Error(`Visible pixels changed in protected diagram/text: ${item.sourcePath}`)
  if (!profile.lossless && !opaque) {
    const beforeAlpha = await pipeline(selected.edge).ensureAlpha().extractChannel('alpha').raw().toBuffer()
    const afterAlpha = await sharp(selected.data).ensureAlpha().extractChannel('alpha').raw().toBuffer()
    if (!beforeAlpha.equals(afterAlpha)) throw new Error(`Alpha changed: ${item.sourcePath}`)
  }
  if (selected.data.length > profile.maxBytes) throw new Error(`Image exceeds its reviewed budget: ${item.sourcePath} (${selected.data.length})`)
  const extension = selected.format === 'jpeg' ? '.jpg' : '.' + selected.format
  const publicPath = '/' + item.sourcePath.slice('docs/public/'.length, -extname(item.sourcePath).length) + extension
  const outputHash = sha(selected.data)
  await writeFile(join(cache, 'candidates', outputHash + extension), selected.data)
  return {
    source: { path: item.sourcePath, sha256: sourceHash, bytes: input.length, width: metadata.width, height: metadata.height, displayWidth: displaySize.width, displayHeight: displaySize.height, format: metadata.format, orientation: metadata.orientation || 1 },
    profile: item.profile,
    reason: item.reason,
    output: { path: publicPath, sha256: outputHash, bytes: selected.data.length, width: outputMeta.width, height: outputMeta.height, format: selected.format },
    encoding: { method: selected.method, quality: selected.quality ?? null, autoOriented: Boolean(metadata.orientation && metadata.orientation !== 1), metadataRemoved: selected.method !== 'unchanged', visiblePixelsIdentical: exactPixels, alphaPreserved: true },
    candidates: candidates.map(candidate => ({ format: candidate.format, method: candidate.method, quality: candidate.quality ?? null, edge: candidate.edge ?? null, bytes: candidate.data.length }))
  }
}

// Two files at a time bounds memory for the original multi-megapixel camera images.
const items = []
for (let offset = 0; offset < policy.items.length; offset += 2) {
  items.push(...await Promise.all(policy.items.slice(offset, offset + 2).map(optimize)))
  if (items.length % 20 === 0) console.log(`Prepared ${items.length}/${policy.items.length} images`)
}
const canonical = new Map()
for (const item of items) {
  const previous = canonical.get(item.output.sha256)
  if (previous) item.output.path = previous.output.path
  else canonical.set(item.output.sha256, item)
}
const sourceBytes = items.reduce((total, item) => total + item.source.bytes, 0)
const outputBytes = [...canonical.values()].reduce((total, item) => total + item.output.bytes, 0)
const record = {
  schemaVersion: 1,
  reviewedAt: new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Shanghai' }).format(new Date()),
  scope: `All ${policy.items.length} raster source images used in the current documentation. Existing SVGs remain vectors and are checked separately.`,
  tool: { name: 'sharp', version: sharp.versions.sharp, vips: sharp.versions.vips },
  summary: { sourceFiles: items.length, publishedFiles: canonical.size, sourceBytes, outputBytes, savedBytes: sourceBytes - outputBytes, reductionPercent: Number(((1 - outputBytes / sourceBytes) * 100).toFixed(2)), protectedLosslessFiles: items.filter(item => policy.profiles[item.profile].lossless).length, resizedPhotos: items.filter(item => item.source.displayWidth !== item.output.width || item.source.displayHeight !== item.output.height).length, normalizedExifOrientations: items.filter(item => item.encoding.autoOriented).length, largestPublishedBytes: Math.max(...items.map(item => item.output.bytes)) },
  originals: 'Originals and candidate comparisons remain in an external content-addressed local cache, not in the Git tree. Source SHA-256 values are preserved in media-inventory.json.',
  gitHistory: 'Replacing working-tree images does not remove large blobs from existing Git history. No remote history is rewritten and no changes are pushed by this script.',
  items
}
await writeFile(join(cache, 'preview.json'), JSON.stringify(record, null, 2) + '\n')
console.log(JSON.stringify(record.summary))
if (!apply) {
  console.log('Preview prepared outside Git. Use --apply after reviewing the candidate images.')
  process.exit(0)
}

const replacements = new Map()
for (const item of items) {
  replacements.set('/' + item.source.path.slice('docs/public/'.length), item.output.path)
  if (prior) {
    const old = prior.items.find(entry => entry.source.path === item.source.path)
    if (old) replacements.set(old.output.path, item.output.path)
  }
}
for (const item of canonical.values()) {
  const extension = item.output.format === 'jpeg' ? '.jpg' : '.' + item.output.format
  await copyFile(join(cache, 'candidates', item.output.sha256 + extension), resolve(root, 'docs/public' + item.output.path))
}
const replacePaths = text => {
  for (const [before, after] of replacements) if (before !== after) text = text.replaceAll(before, after)
  return text
}
const ledger = await json('audit/media-inventory.json')
const outputs = new Map(items.map(item => ['/' + item.source.path.slice('docs/public/'.length), item]))
for (const item of ledger.items) {
  if (!item.publicPath) continue
  let image = outputs.get(item.publicPath)
  if (!image && prior) image = items.find(entry => entry.source.sha256 === item.sha256)
  if (!image || image.source.sha256 !== item.sha256) throw new Error(`Source ledger mismatch: ${item.id}`)
  item.publicPath = image.output.path
}
await save('audit/media-inventory.json', ledger)
const dimensions = await json('docs/.vitepress/data/image-dimensions.json')
for (const [before, after] of replacements) if (before !== after) delete dimensions[before]
for (const item of canonical.values()) dimensions[item.output.path] = { width: item.output.width, height: item.output.height }
await save('docs/.vitepress/data/image-dimensions.json', dimensions)
for (const locale of locales) {
  for (const [path, { raw }] of await readPages(locale)) {
    // Markdown uses repository-relative paths; website-root URLs alone will not match.
    const before = raw
    let after = replacePaths(before)
    for (const [source, output] of replacements) {
      if (source !== output) after = after.replaceAll(`public${source}`, `public${output}`)
    }
    if (before !== after) await writeFile(resolve(root, 'docs', locale, path), after)
  }
}
await save('audit/image-optimization.json', record)
const activePaths = new Set([...canonical.values()].map(item => item.output.path))
for (const [before] of replacements) if (!activePaths.has(before)) await rm(resolve(root, 'docs/public' + before), { force: true })
console.log('Applied optimized images, article paths, intrinsic dimensions and source/derivative checksums locally.')
