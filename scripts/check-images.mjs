import { readFile, readdir, stat } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { resolve, relative } from 'node:path'
import sharp from 'sharp'

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
    if (record) {
      const hash = createHash('sha256').update(await readFile(file)).digest('hex')
      if (hash !== record.output.sha256 || size !== record.output.bytes) failures.push(`${publicPath}: published derivative does not match its optimization record`)
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
