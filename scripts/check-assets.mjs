import { readFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const ledger = JSON.parse(await readFile(resolve(root, 'audit/media-inventory.json'), 'utf8'))
const release = JSON.parse(await readFile(resolve(root, 'audit/release-assets.json'), 'utf8'))
const materials = JSON.parse(await readFile(resolve(root, 'docs/.vitepress/data/materials.json'), 'utf8'))
const ids = new Set()
let images = 0
for (const item of ledger.items) {
  if (ids.has(item.id)) throw new Error(`Duplicate material ${item.id}`)
  ids.add(item.id)
  if (!item.decision || !item.reason) throw new Error(`Missing disposition ${item.id}`)
  if (item.publicPath) {
    if (!item.publicPath.startsWith('/images/zh/')) throw new Error(`Unexpected path ${item.id}`)
    const bytes = await readFile(resolve(root, 'docs/public' + item.publicPath))
    const sha = createHash('sha256').update(bytes).digest('hex')
    if (sha !== (item.publishedAsset?.sha256 || item.sha256)) throw new Error(`Image changed without ledger update: ${item.id}`)
    images++
  }
}
const assets = new Map(release.assets.map(item => [item.url, item]))
for (const item of Object.values(materials).flat()) {
  const asset = assets.get(item.url)
  if (!asset || asset.sha256 !== item.sha256 || asset.size !== item.size || !ids.has(item.id)) {
    throw new Error(`Registry/release/ledger mismatch: ${item.id}`)
  }
  const url = new URL(item.url)
  if (url.origin !== 'https://github.com' || !url.pathname.startsWith('/78/xiaozhi-docs/releases/download/') || url.search) {
    throw new Error(`Unexpected public material URL: ${item.id}`)
  }
}
for (const path of ['audit/media-inventory.json', 'audit/release-assets.json', 'docs/.vitepress/data/materials.json']) {
  const text = await readFile(resolve(root, path), 'utf8')
  if (/"token"\s*:|[?&](?:token|signature|access_token)=|\/Users\/|\/var\/folders\//i.test(text)) {
    throw new Error(`Private source data in ${path}`)
  }
}
if (ids.size !== 1094) throw new Error('The source-material inventory must cover all 1094 embedded references')
console.log(`Material checks passed: ${ids.size} dispositions; ${images} original images; ${assets.size} release files.`)
