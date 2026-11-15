import { readPages } from './content.mjs'

const pages = new Map()
for (const [path, { content: body }] of await readPages('zh')) {
  const page = `docs/zh/${path}`
  pages.set(page, body)
  // Discussion contacts change frequently and must stay in the shared header configuration.
  if (/discord\.gg\/|(?:QQ\s*群?\s*[:：]?\s*\d{5,}|群号\s*[:：]?\s*\d{5,})/i.test(body)) {
    throw new Error(`${page}: move discussion contacts to the header configuration`)
  }
  if (/原教程|旧教程|素材状态见|源文档的.*筛选|审计清单/.test(body)) {
    throw new Error(`${page}: keep migration bookkeeping in audit/`)
  }
}
for (const page of ['getting-started/index', 'firmware/index', 'firmware/downloads', 'firmware/flashing']) {
  if (!pages.get(`docs/zh/${page}.md`).includes('https://xiaozhi.me/console/firmware-builder')) {
    throw new Error(`${page}: preserve the recommended online flashing entry`)
  }
}
console.log(`Reader checks passed: ${pages.size} pages; online flashing entries and centralized discussion contacts.`)
