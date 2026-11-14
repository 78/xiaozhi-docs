import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import matter from 'gray-matter'

const root = resolve(import.meta.dirname, '..')
const read = path => readFile(resolve(root, path), 'utf8')
const catalog = JSON.parse(await read('audit/firmware-download-catalog.json'))
const chipNames = {
  esp32: 'ESP32', esp32s3: 'ESP32-S3', esp32c3: 'ESP32-C3',
  esp32c5: 'ESP32-C5', esp32c6: 'ESP32-C6', esp32p4: 'ESP32-P4', esp32s31: 'ESP32-S31'
}
let downloads = 0
for (const version of catalog.versions) {
  const page = await read(version.page)
  const assets = new Map(version.assets.map(asset => [asset.filename, asset]))
  const seen = new Set()
  const tableRows = page.split('\n').filter(line => line.startsWith('| '))
  if (!/^[a-f0-9]{40}$/.test(version.sourceCommit)) throw new Error('Pin the owning firmware revision')
  for (const entry of version.entries) {
    const asset = assets.get(entry.filename)
    const expected = `https://github.com/78/xiaozhi-esp32/releases/download/${version.version}/${entry.filename}`
    const row = tableRows.find(line => line.includes(`[${entry.filename}](`))
    if (!asset || seen.has(entry.filename) || entry.url !== expected || asset.url !== expected || entry.bytes !== asset.bytes) {
      throw new Error(`Unverified or duplicate release asset: ${entry.filename}`)
    }
    if (!chipNames[entry.target] || entry.chip.split(' Rev')[0] !== chipNames[entry.target]) {
      throw new Error(`Chip does not match the recorded firmware target: ${entry.filename}`)
    }
    if (!/^[a-f0-9]{40}$/.test(entry.sourceConfigBlob) || !entry.sourceConfig.startsWith('main/boards/')) {
      throw new Error(`Missing owning board configuration: ${entry.filename}`)
    }
    if (!row || !row.includes(`| ${entry.name} | ${entry.chip} |`) || !row.includes(`](${expected})`)) {
      throw new Error(`Missing product/chip/filename relationship in ${version.page}: ${entry.filename}`)
    }
    seen.add(entry.filename)
  }
  for (const entry of version.excludedAssets) {
    if (!assets.has(entry.filename) || seen.has(entry.filename) || !entry.reason) throw new Error('Explain each excluded release asset')
    if (page.includes(entry.filename)) throw new Error(`Excluded build must not be offered: ${entry.filename}`)
    seen.add(entry.filename)
  }
  if (seen.size !== assets.size || version.counts.publishedRows !== version.entries.length) throw new Error('Incomplete release-asset coverage')
  const linkedVersions = [...page.matchAll(/releases\/download\/(v[\d.]+)\//g)].map(match => match[1])
  if (linkedVersions.some(tag => tag !== version.version)) throw new Error(`Mixed download versions in ${version.page}`)
  downloads += version.entries.length
}
const navigation = await read('docs/.vitepress/navigation.ts')
for (const version of catalog.versionPolicy.legacyRedirects) {
  if (navigation.includes(`"releases/${version}"`)) throw new Error('Retired version still appears in navigation')
  for (const locale of ['zh', 'en']) {
    const page = matter(await read(`docs/${locale}/firmware/releases/${version}.md`))
    if (page.data.status !== 'draft' || !page.data.redirectTo?.includes(`/${locale}/firmware/releases/v2.6.0.html`)) {
      throw new Error('Preserve retired URLs as draft redirects')
    }
    if (!page.data.head?.some(item => item[0] === 'meta' && item[1]?.['http-equiv'] === 'refresh' && item[1]?.content.includes('v2.6.0.html'))) {
      throw new Error('Retired URL must redirect without JavaScript')
    }
  }
}
console.log(`Firmware downloads passed: ${downloads} named/chip-matched downloads; all ${catalog.versions.reduce((sum, version) => sum + version.assets.length, 0)} release assets accounted for; two maintained versions.`)
