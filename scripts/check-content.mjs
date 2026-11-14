import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { root, locales, readPages } from './content.mjs'

const errors = []
const all = new Map()
for (const locale of locales) {
  const pages = await readPages(locale)
  all.set(locale, pages)
  const ids = new Set()
  for (const [path, { data, content }] of pages) {
    const label = `${locale}/${path}`
    for (const field of ['id', 'title', 'description']) {
      if (typeof data[field] !== 'string' || !data[field].trim()) errors.push(`${label}: missing ${field}`)
    }
    if (ids.has(data.id)) errors.push(`${label}: duplicate id ${data.id}`)
    ids.add(data.id)
    if (!['draft', 'review', 'published'].includes(data.status)) errors.push(`${label}: status must be draft, review or published`)
    if (locale !== 'zh' && data.translation?.status !== 'pending' && !/^[a-f0-9]{64}$/.test(data.translation?.sourceHash || '')) {
      errors.push(`${label}: translation.sourceHash must record the reviewed Chinese revision`)
    }
    if (locale !== 'zh' && data.translation?.status === 'pending' && data.status !== 'draft') {
      errors.push(`${label}: a pending translation must remain a draft`)
    }
    if (data.status === 'review' && (locale !== 'zh' || !data.reviewedAt || !data.reviewNote)) {
      errors.push(`${label}: community review needs Chinese scope, reviewedAt and reviewNote`)
    }
    // A translated page must not silently send readers back into Chinese guides.
    if (locale === 'en' && /\]\(\/zh\//.test(content)) errors.push(`${label}: English article links into Chinese content`)
    const readerText = content.replace(/<!--[^]*?-->/g, '').replace(/<SourceMaterials\b[^>]*\/>/g, '')
    if (/\bDOC-\d{2}\b|资料来源：|来源：DOC-/.test(readerText)) {
      errors.push(`${label}: keep migration IDs and provenance bookkeeping in audit/, not reader-facing prose`)
    }
    if (/https?:\/\/[^\s)"']*feishu\.cn\/file\//i.test(content)) {
      errors.push(`${label}: download embedded Feishu images into docs/public/images before publication`)
    }
  }
}
for (const locale of locales) {
  for (const [path, { data }] of all.get(locale)) {
    for (const other of locales.filter(candidate => candidate !== locale)) {
      const counterpart = all.get(other).get(path)
      if (!counterpart) errors.push(`${locale}/${path}: missing ${other} counterpart (a draft stub is allowed)`)
      else if (counterpart.data.id !== data.id) errors.push(`${locale}/${path}: counterpart id differs`)
    }
  }
}

const inventory = JSON.parse(await readFile(resolve(root, 'audit/inventory.json'), 'utf8'))
const snapshot = JSON.parse(await readFile(resolve(root, 'audit', inventory.sourceSnapshot), 'utf8'))
const tokens = new Set()
const priorityRanks = new Set()
for (const item of inventory.items) {
  if (tokens.has(item.sourceToken)) errors.push(`audit: duplicate sourceToken ${item.sourceToken}`)
  tokens.add(item.sourceToken)
  if (!['pending', 'reviewed'].includes(item.reviewStatus)) errors.push(`audit: invalid reviewStatus for ${item.title}`)
  if (item.reviewStatus === 'reviewed') {
    if (!['retain', 'rewrite', 'merge', 'archive', 'remove'].includes(item.decision)) errors.push(`audit: reviewed item needs a decision: ${item.title}`)
    if (!item.evidence?.length) errors.push(`audit: decision needs evidence: ${item.title}`)
    if (!item.targetPath) errors.push(`audit: decision needs targetPath or archive/removal explanation: ${item.title}`)
    if (!['P0', 'P1', 'P2'].includes(item.priority)) errors.push(`audit: reviewed item needs a priority: ${item.title}`)
    if (!Number.isInteger(item.priorityRank) || item.priorityRank < 1 || item.priorityRank > snapshot.items.length) {
      errors.push(`audit: reviewed item needs a valid priorityRank: ${item.title}`)
    } else if (priorityRanks.has(item.priorityRank)) {
      errors.push(`audit: duplicate priorityRank ${item.priorityRank}`)
    } else {
      priorityRanks.add(item.priorityRank)
    }
  }
}
if (snapshot.items.length !== tokens.size || snapshot.items.some(item => !tokens.has(item.token))) {
  errors.push('audit: inventory must cover every article in the source snapshot')
}
if (errors.length) {
  console.error(errors.join('\n'))
  process.exitCode = 1
} else {
  console.log(`Content checks passed: ${[...all.values()].reduce((sum, pages) => sum + pages.size, 0)} localized pages; ${tokens.size} source articles accounted for.`)
}
