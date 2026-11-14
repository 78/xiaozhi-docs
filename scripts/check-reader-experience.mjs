import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { createHash } from 'node:crypto'
import matter from 'gray-matter'

const root = resolve(import.meta.dirname, '..')
const review = JSON.parse(await readFile(resolve(root, 'audit/reader-review-2026-11-14.json'), 'utf8'))
const pages = new Map()
for (const item of review.pages) {
  const text = await readFile(resolve(root, item.page), 'utf8')
  const body = matter(text).content
  pages.set(item.page, body)
  // Discussion contacts change frequently and must stay in the shared header configuration.
  if (/discord\.gg\/|(?:QQ\s*群?\s*[:：]?\s*\d{5,}|群号\s*[:：]?\s*\d{5,})/i.test(body)) {
    throw new Error(`${item.page}: move discussion contacts to the header configuration`)
  }
  if (/原教程|旧教程|素材状态见|源文档的.*筛选|审计清单/.test(body)) {
    throw new Error(`${item.page}: keep migration bookkeeping in audit/`)
  }
  for (const prefix of review.forbiddenLegacyConsoleFigures) {
    if (body.includes(prefix + '.')) throw new Error(`${item.page}: outdated Console screenshot ${prefix}`)
  }
}
for (const figure of review.requiredFigures) {
  const text = pages.get(figure.page)
  const headings = [...text.matchAll(/^(#{1,6})\s+.*?\{#([^}]+)\}.*$/gm)]
  let body
  if (figure.anchor) {
    const start = headings.find(h => h[2] === figure.anchor)
    if (!start) throw new Error(`${figure.page}: missing #${figure.anchor}`)
    const next = headings.find(h => h.index > start.index && h[1].length <= start[1].length)
    body = text.slice(start.index, next?.index ?? text.length)
  } else {
    body = text.slice(0, text.search(/^## /m) < 0 ? text.length : text.search(/^## /m))
  }
  if (!body.includes(figure.image)) {
    throw new Error(`${figure.page}#${figure.anchor ?? 'intro'}: missing ${figure.image} (${figure.purpose})`)
  }
}
for (const page of ['getting-started/index', 'firmware/index', 'firmware/downloads', 'firmware/flashing']) {
  if (!pages.get(`docs/zh/${page}.md`).includes('https://xiaozhi.me/console/firmware-builder')) {
    throw new Error(`${page}: preserve the recommended online flashing entry`)
  }
}
for (const figure of review.generatedFigures) {
  const bytes = await readFile(resolve(root, 'docs/public' + figure.path))
  if (createHash('sha256').update(bytes).digest('hex') !== figure.sha256) {
    throw new Error(`Update the reviewed diagram record: ${figure.path}`)
  }
}
console.log(`Reader checks passed: ${pages.size} reviewed pages; ${review.requiredFigures.length} figure/section relationships; centralized discussion contacts.`)
