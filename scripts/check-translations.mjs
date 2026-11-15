import { readFile, readdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { readPages, sourceHash, root } from './content.mjs'
import { publicImageUrl } from './public-images.mjs'

const diagramSources = new Map()
for (const name of await readdir(resolve(root, 'docs/public/images/en'))) {
  if (!name.endsWith('.svg')) continue
  const locale = existsSync(resolve(root, 'docs/public/images/zh', name)) ? 'zh' : 'shared'
  diagramSources.set(`/images/en/${name}`, `/images/${locale}/${name}`)
}
const sources = await readPages('zh')
const translations = await readPages('en')
const anchors = body => [...body.matchAll(/^#{1,6} .*?\{#([^}]+)\}/gm)].map(match => match[1])
const attachments = body => [...body.matchAll(/<SourceMaterials\b[^>]*\/>/g)].map(match => match[0])
const equal = (a, b) => JSON.stringify(a) === JSON.stringify(b)
let fresh = 0
let illustrations = 0
for (const [path, translated] of translations) {
  const source = sources.get(path)
  if (translated.data.translation?.status === 'pending' || translated.data.translation?.sourceHash !== sourceHash(source.raw)) continue
  if (!equal(anchors(source.content), anchors(translated.content))) throw new Error(`${path}: preserve matching chapter anchors`)
  if (!equal(attachments(source.content), attachments(translated.content))) throw new Error(`${path}: missing or changed attachments`)
  const images = (body, locale) => [...body.matchAll(/!\[[^\]]*\]\(([^)]+)\)/g)].map(match => {
    const image = publicImageUrl(match[1], resolve(root, 'docs', locale, path), resolve(root, 'docs/public'))
    return diagramSources.get(image) || image
  }).sort()
  const expected = images(source.content, 'zh')
  if (!equal(expected, images(translated.content, 'en'))) throw new Error(`${path}: preserve counterpart images`)
  illustrations += expected.length
  fresh++
}
// A localized wiring diagram must not silently change paths, coordinates, or signal connections.
const withoutLabels = svg => svg.replace(/<(title|desc|text)(\s[^>]*)?>[^]*?<\/\1>/g, (_, tag, attrs = '') => `<${tag}${attrs}></${tag}>`)
for (const [path, sourcePath] of diagramSources) {
  const source = await readFile(resolve(root, 'docs/public' + sourcePath), 'utf8')
  const translated = await readFile(resolve(root, 'docs/public' + path), 'utf8')
  if (withoutLabels(source) !== withoutLabels(translated)) throw new Error(`${path}: localized diagram geometry differs`)
  if (/[\u4e00-\u9fff]/.test(translated.replace(/<style>[^]*?<\/style>/g, ''))) throw new Error(`${path}: untranslated diagram text`)
}
console.log(`Translation checks passed: ${fresh} current counterparts; ${illustrations} matching images; ${diagramSources.size} localized diagrams with unchanged geometry.`)
