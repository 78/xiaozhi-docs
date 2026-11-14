import { readFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { resolve } from 'node:path'
import { publicImageUrl } from './public-images.mjs'

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
    if (item.publishedAsset && (item.publishedAsset.sourceSha256 !== item.sha256 || item.publishedAsset.path !== item.publicPath)) {
      throw new Error(`Original/optimized-image relationship changed: ${item.id}`)
    }
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
// A valid image inventory is insufficient when the teaching figures disappear from their chapters.
const coverage = JSON.parse(await readFile(resolve(root, 'audit/hardware-illustrations.json'), 'utf8'))
const byId = new Map(ledger.items.map(item => [item.id, item]))
let sections = 0
for (const page of coverage.pages) {
  const text = await readFile(resolve(root, page.page), 'utf8')
  const headings = [...text.matchAll(/^(#{1,6})\s+.*?\{#([^}]+)\}.*$/gm)]
  for (const section of page.sections) {
    const heading = headings.find(match => match[2] === section.anchor)
    if (!heading) throw new Error(`${page.page}: missing teaching section #${section.anchor}`)
    const next = headings.find(match => match.index > heading.index && match[1].length <= heading[1].length)
    const body = text.slice(heading.index, next?.index ?? text.length)
    for (const id of section.sourceImages) {
      const item = byId.get(id)
      if (item?.decision !== 'retained-local-image' || !body.includes(item.publicPath)) {
        throw new Error(`${page.page}#${section.anchor}: missing ${id} (${section.purpose})`)
      }
    }
    for (const path of section.diagrams) {
      if (!body.includes(path)) throw new Error(`${page.page}#${section.anchor}: missing diagram ${path}`)
    }
    if (section.allowedImagesOnly) {
      for (const image of body.matchAll(/!\[[^\]]*\]\(([^)]+)\)/g)) {
        if (!section.allowedImagesOnly.includes(publicImageUrl(image[1], resolve(root, page.page), resolve(root, 'docs/public')))) {
          throw new Error(`${page.page}#${section.anchor}: unrelated figure ${image[1]}`)
        }
      }
    }
    sections++
  }
}
const selection = await readFile(resolve(root, coverage.selectionPage), 'utf8')
for (const id of coverage.selectionForbiddenComponentImages) {
  const path = byId.get(id)?.publicPath
  if ((path && selection.includes(path)) || selection.includes(`/${id.toLowerCase()}.`)) {
    throw new Error(`Component figure ${id} belongs in its construction tutorial, not the selection page`)
  }
}
const wiring = JSON.parse(await readFile(resolve(root, 'audit/wiring-diagrams.json'), 'utf8'))
const dimensions = JSON.parse(await readFile(resolve(root, 'docs/.vitepress/data/image-dimensions.json'), 'utf8'))
for (const path of [...ledger.items.filter(item => item.publicPath).map(item => item.publicPath), ...wiring.diagrams.map(item => item.publicPath)]) {
  const size = dimensions[path]
  if (!Number.isInteger(size?.width) || !Number.isInteger(size?.height) || size.width <= 0 || size.height <= 0) {
    throw new Error(`Record intrinsic image dimensions before publication: ${path}`)
  }
}
for (const diagram of wiring.diagrams) {
  const bytes = await readFile(resolve(root, 'docs/public' + diagram.publicPath))
  if (createHash('sha256').update(bytes).digest('hex') !== diagram.sha256) {
    throw new Error(`Wiring diagram changed without review record: ${diagram.publicPath}`)
  }
}
console.log(`Material checks passed: ${ids.size} dispositions; ${images} source-image references; ${assets.size} release files.`)
console.log(`Teaching illustrations passed: ${coverage.pages.length} tutorials; ${sections} required sections; ${wiring.diagrams.length} current wiring diagrams.`)
