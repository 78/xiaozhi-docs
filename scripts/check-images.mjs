import { readFile, readdir, stat } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { dirname, resolve, relative } from 'node:path'
import sharp from 'sharp'
import { createMarkdownRenderer } from 'vitepress'
import { readPages, locales } from './content.mjs'
import { publicImageUrl } from './public-images.mjs'

const root = resolve(import.meta.dirname, '..')
const policy = JSON.parse(await readFile(resolve(root, 'audit/image-policy.json'), 'utf8'))
const report = JSON.parse(await readFile(resolve(root, 'audit/image-optimization.json'), 'utf8'))
const dimensions = JSON.parse(await readFile(resolve(root, 'docs/.vitepress/data/image-dimensions.json'), 'utf8'))
const outputs = new Map(report.items.map(item => [item.output.path, item]))
const auditOnly = process.argv.includes('--audit')
const failures = []
let rasterBytes = 0
let rasterCount = 0
let vectorCount = 0
const largest = []
let markdownImages = 0
let imageLinks = 0

// Validate the source links GitHub reads, rather than only checking website assets.
const markdown = await createMarkdownRenderer(resolve(root, 'docs'))
async function checkReference(url, file) {
  if (/^(?:https?:)?\/\//i.test(url)) return
  const publicUrl = publicImageUrl(url, file, resolve(root, 'docs/public'))
  if (url.startsWith('/') || !publicUrl.startsWith('/images/')) {
    failures.push(`${relative(root, file)}: use a relative path to docs/public/images so GitHub can show ${url}`)
    return
  }
  try {
    const filePath = decodeURIComponent(url.split(/[?#]/)[0])
    if (!(await stat(resolve(dirname(file), filePath))).isFile()) throw new Error('Not a file')
  } catch {
    failures.push(`${relative(root, file)}: missing repository image ${url}`)
  }
}
async function checkTokens(tokens, file) {
  for (const token of tokens) {
    if (token.type === 'image') {
      markdownImages++
      await checkReference(token.attrGet('src'), file)
    } else if (token.type === 'link_open' && /\.(?:png|jpe?g|svg|webp|gif|avif)(?:[?#]|$)/i.test(token.attrGet('href') || '')) {
      imageLinks++
      await checkReference(token.attrGet('href'), file)
    }
    if (token.children) await checkTokens(token.children, file)
  }
}
for (const locale of locales) {
  for (const [path, { content }] of await readPages(locale)) {
    const file = resolve(root, 'docs', locale, path)
    await checkTokens(markdown.parse(content, { path: file, relativePath: `${locale}/${path}` }), file)
  }
}

async function inspect(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = resolve(directory, entry.name)
    if (entry.isDirectory()) { await inspect(file); continue }
    const publicPath = '/' + relative(resolve(root, 'docs/public'), file)
    const size = (await stat(file)).size
    if (/\.svg$/i.test(entry.name)) {
      vectorCount++
      if (size > policy.maxSvgBytes) failures.push(`${publicPath}: oversized SVG (${size} bytes)`)
      continue
    }
    if (!/\.(png|jpe?g|webp|gif|avif|tiff?)$/i.test(entry.name)) continue
    const meta = await sharp(file).metadata()
    const record = outputs.get(publicPath)
    const profile = record ? policy.profiles[record.profile] : policy.defaultNewImage
    rasterCount++
    rasterBytes += size
    largest.push({ path: publicPath, bytes: size, width: meta.width, height: meta.height, profile: record?.profile || 'new-image' })
    if (size > profile.maxBytes) failures.push(`${publicPath}: ${size} bytes exceeds ${profile.maxBytes}; optimize before submitting`)
    if (profile.maxLongEdge && Math.max(meta.width, meta.height) > profile.maxLongEdge) failures.push(`${publicPath}: exceeds ${profile.maxLongEdge}px`)
    if (meta.orientation && meta.orientation !== 1) failures.push(`${publicPath}: normalize EXIF orientation before stripping metadata`)
    if (dimensions[publicPath]?.width !== meta.width || dimensions[publicPath]?.height !== meta.height) failures.push(`${publicPath}: missing or incorrect intrinsic dimensions`)
    if (record && profile.lossless) {
      const hash = createHash('sha256').update(await readFile(file)).digest('hex')
      if (hash !== record.output.sha256 || size !== record.output.bytes) failures.push(`${publicPath}: protected text/wiring changed; review and update its optimization record`)
    }
  }
}
await inspect(resolve(root, 'docs/public'))
for (const item of report.items) {
  if (policy.profiles[item.profile].lossless) {
    if (item.encoding.visiblePixelsIdentical !== true || item.output.width !== item.source.displayWidth || item.output.height !== item.source.displayHeight) failures.push(`${item.source.path}: protected text/wiring must preserve visible pixels and display dimensions`)
  }
}
if (rasterBytes > policy.maxTotalRasterBytes) failures.push(`Raster total ${rasterBytes} exceeds reviewed site budget ${policy.maxTotalRasterBytes}`)
if (auditOnly) console.log(JSON.stringify({ rasterCount, rasterBytes, vectorCount, largest: largest.sort((a, b) => b.bytes - a.bytes).slice(0, 12) }, null, 2))
if (failures.length) throw new Error(failures.join('\n'))
console.log(`Image budgets passed: ${rasterCount} rasters, ${(rasterBytes / 1048576).toFixed(2)} MiB; ${vectorCount} SVGs; protected text/wiring retains its pixels.`)
console.log(`GitHub image paths passed: ${markdownImages} Markdown images and ${imageLinks} image links resolve to repository files.`)
