import { readFile } from 'node:fs/promises'
import { resolve, relative, extname } from 'node:path'
import { pathToFileURL, fileURLToPath } from 'node:url'
import { createMarkdownRenderer } from 'vitepress'
import matter from 'gray-matter'
import { root, locales, readPages } from './content.mjs'

const docs = resolve(root, 'docs')
const sources = new Map([[resolve(docs, 'index.md'), matter(await readFile(resolve(docs, 'index.md'), 'utf8')).content]])
for (const locale of locales) {
  for (const [path, { content }] of await readPages(locale)) sources.set(resolve(docs, locale, path), content)
}
const markdown = await createMarkdownRenderer(docs)
const pages = new Map()
let anchors = 0
for (const [file, content] of sources) {
  const tokens = markdown.parse(content, { path: file, relativePath: relative(docs, file) })
  const names = new Set()
  const links = []
  function inspect(items) {
    for (const token of items) {
      if (token.type === 'link_open' && !token.attrGet('class')?.split(' ').includes('header-anchor')) links.push(token.attrGet('href'))
      if (token.type === 'html_inline' || token.type === 'html_block') {
        for (const match of token.content.matchAll(/<a name="([^"]+)">/g)) {
          if (names.has(match[1])) throw new Error(`${relative(root, file)}: duplicate named anchor #${match[1]}`)
          names.add(match[1])
          anchors++
        }
      }
      if (token.children) inspect(token.children)
    }
  }
  inspect(tokens)
  const lines = content.split('\n')
  for (const token of tokens.filter(token => token.type === 'heading_open')) {
    const explicit = /\{#([^}]+)\}/.exec(lines[token.map[0]])
    if (explicit && (!names.has(explicit[1]) || !lines.slice(0, token.map[0]).join('\n').trimEnd().endsWith(`<a name="${explicit[1]}"></a>`))) {
      throw new Error(`${relative(root, file)}: add the GitHub named anchor immediately before #${explicit[1]}`)
    }
  }
  pages.set(file, { names, links })
}
let articleLinks = 0
let sectionLinks = 0
for (const [file, page] of pages) {
  for (const href of page.links) {
    if (/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(href)) continue
    const url = new URL(href, pathToFileURL(file))
    const target = fileURLToPath(url)
    // Public images and downloadable files have their own checks.
    if (extname(target) && extname(target) !== '.md' && extname(target) !== '.html') continue
    if (href.startsWith('/') || (!href.startsWith('#') && extname(target) !== '.md')) {
      throw new Error(`${relative(root, file)}: use a relative .md article path: ${href}`)
    }
    const destination = pages.get(target)
    if (!destination) throw new Error(`${relative(root, file)}: missing article ${href}`)
    if (url.hash) {
      const anchor = decodeURIComponent(url.hash.slice(1))
      if (!destination.names.has(anchor)) throw new Error(`${relative(root, file)}: missing GitHub anchor ${href}`)
      sectionLinks++
    }
    if (relative(docs, file).startsWith('en/') && relative(docs, target).startsWith('zh/')) {
      throw new Error(`${relative(root, file)}: English body must link to its English counterpart`)
    }
    articleLinks++
  }
}
console.log(`Article links passed: ${articleLinks} repository links; ${sectionLinks} section links; ${anchors} GitHub named anchors.`)
