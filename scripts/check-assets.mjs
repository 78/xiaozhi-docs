import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { createHash } from 'node:crypto'

const root = resolve(import.meta.dirname, '..')
const ledger = JSON.parse(await readFile(resolve(root, 'audit/media-inventory.json'), 'utf8'))
const inventory = JSON.parse(await readFile(resolve(root, 'audit/inventory.json'), 'utf8'))
const release = JSON.parse(await readFile(resolve(root, 'audit/release-assets.json'), 'utf8'))
const materials = JSON.parse(await readFile(resolve(root, 'docs/.vitepress/data/materials.json'), 'utf8'))
const englishMaterials = JSON.parse(await readFile(resolve(root, 'docs/.vitepress/data/materials.en.json'), 'utf8'))
const ids = new Set()
for (const item of ledger.items) {
  if (ids.has(item.id)) throw new Error(`Duplicate material ${item.id}`)
  ids.add(item.id)
  if (!item.decision || !item.reason) throw new Error(`Missing disposition ${item.id}`)
}
const expected = inventory.items.reduce((count, item) => count + item.sourceReview.embeddedReferences.images + item.sourceReview.embeddedReferences.files, 0)
  + (ledger.supplementalSources || []).reduce((count, source) => count + source.embeddedReferences, 0)
if (ids.size !== expected) throw new Error('Incomplete source-material coverage')
const assets = new Map(release.assets.map(item => [item.url, item]))
for (const item of Object.values(materials).flat()) {
  const translation = englishMaterials[item.id]
  if (!translation?.label || !translation?.note || Object.keys(translation).some(key => !['label', 'note'].includes(key))) {
    throw new Error(`English material labels must be complete without overriding file identity: ${item.id}`)
  }
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
console.log(`Material checks passed: ${ids.size} source dispositions; ${assets.size} release files; shared attachment identities and English labels.`)
// Keep the existing six versioned wiring diagrams, including their chapter context.
const wiring = JSON.parse(await readFile(resolve(root, 'audit/wiring-diagrams.json'), 'utf8'))
for (const diagram of wiring.diagrams) {
  const bytes = await readFile(resolve(root, 'docs/public' + diagram.publicPath))
  if (createHash('sha256').update(bytes).digest('hex') !== diagram.sha256) throw new Error(`Review the changed wiring diagram: ${diagram.publicPath}`)
  if (!/^[a-f0-9]{40}$/.test(diagram.firmwareCommit) || !diagram.sourceFiles?.length) throw new Error(`Pin the owning firmware: ${diagram.publicPath}`)
  const page = await readFile(resolve(root, 'docs/zh', diagram.page), 'utf8')
  const headings = [...page.matchAll(/^(#{1,6})\s+.*?\{#([^}]+)\}.*$/gm)]
  const heading = headings.find(match => match[2] === diagram.anchor)
  if (!heading) throw new Error(`${diagram.page}: missing #${diagram.anchor}`)
  const next = headings.find(match => match.index > heading.index && match[1].length <= heading[1].length)
  if (!page.slice(heading.index, next?.index ?? page.length).includes(diagram.publicPath)) throw new Error(`${diagram.page}: missing ${diagram.publicPath}`)
}
console.log(`Wiring checks passed: ${wiring.diagrams.length} versioned diagrams.`)
