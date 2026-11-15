import { readFile, access } from 'node:fs/promises'
import { resolve } from 'node:path'
import matter from 'gray-matter'
import { hostname } from '../site.config.mjs'
import { root } from './content.mjs'
import { isIndexable, readDiscoveryPages, pagePath, language } from './discovery.mjs'

const outDir = resolve(root, 'docs/.vitepress/dist')
const read = path => readFile(resolve(outDir, path.replace(/^\//, '')), 'utf8')
const ensure = (value, message) => { if (!value) throw new Error(message) }
const decode = text => text.replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
const tags = (html, name) => [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, 'g'))].map(match =>
  Object.fromEntries([...match[0].matchAll(/([\w:-]+)="([^"]*)"/g)].map(attr => [attr[1], decode(attr[2])])) )
const pages = readDiscoveryPages(resolve(root, 'docs'))
const eligible = [...pages.values()].filter(page => isIndexable(page.data))
const urls = new Set([hostname + '/', ...eligible.map(page => hostname + pagePath(page.path))])
let representations = 0
for (const page of pages.values()) {
  const html = await read(page.path.replace(/\.md$/, '.html'))
  const links = tags(html, 'link')
  const meta = tags(html, 'meta')
  const indexed = isIndexable(page.data)
  const robots = meta.filter(tag => /^(robots|googlebot)$/.test(tag.name)).map(tag => tag.content).join(',')
  ensure(indexed ? !/\bnoindex\b|\bnone\b/.test(robots) : /\bnoindex\b|\bnone\b/.test(robots), `${page.path}: incorrect index policy`)
  const canonical = links.filter(tag => tag.rel === 'canonical')
  ensure(canonical.length === 1, `${page.path}: exactly one canonical`)
  const expected = hostname + (page.data.redirectTo?.split('#')[0] || pagePath(page.path))
  ensure(canonical[0].href === expected, `${page.path}: incorrect canonical`)
  if (!indexed) {
    ensure(!links.some(tag => tag.type === 'text/markdown'), `${page.path}: excluded content offered as Markdown`)
    continue
  }
  for (const alternate of links.filter(tag => tag.hreflang)) ensure(urls.has(alternate.href), `${page.path}: alternate is not indexable`)
  const counterpart = page.path.replace(/^(zh|en)\//, page.path.startsWith('zh/') ? 'en/' : 'zh/')
  if (isIndexable(pages.get(counterpart)?.data || {})) ensure(links.some(tag => tag.hreflang === language(counterpart) && tag.href === hostname + pagePath(counterpart)), `${page.path}: missing translation link`)
  ensure(meta.some(tag => tag.property === 'og:description' && tag.content === page.data.description), `${page.path}: missing social description`)
  const structured = [...html.matchAll(/<script type="application\/ld\+json">([^]*?)<\/script>/g)].map(match => JSON.parse(match[1]))
  ensure(structured.length === 1, `${page.path}: missing or duplicate JSON-LD`)
  const document = structured[0]['@graph'].find(item => ['TechArticle', 'CollectionPage'].includes(item['@type']))
  ensure(document?.url === expected && document.name === page.data.title && document.inLanguage === language(page.path), `${page.path}: structured data does not match page`)
  const markdown = links.find(tag => tag.type === 'text/markdown')
  ensure(markdown?.href === hostname + '/' + page.path, `${page.path}: missing Markdown discovery link`)
  const text = await read(page.path)
  const parsed = matter(text)
  ensure(parsed.data.canonical === expected && parsed.data.status === page.data.status, `${page.path}: export loses canonical/status`)
  ensure(!/SourceMaterials|sourceArticles:|sourceHash:|<figure|<figcaption|^<<</m.test(text), `${page.path}: unexpanded components or internal metadata`)
  ensure(text.includes('https://creativecommons.org/licenses/by/4.0/'), `${page.path}: missing text license`)
  representations++
}
const sitemap = await read('sitemap.xml')
const locations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => decode(match[1]))
ensure(locations.length === urls.size && new Set(locations).size === urls.size && locations.every(url => urls.has(url)), 'Sitemap must contain all and only eligible HTML URLs')
for (const match of sitemap.matchAll(/hreflang="[^"]+" href="([^"]+)"/g)) ensure(urls.has(decode(match[1])), 'Sitemap advertises an excluded translation')
const robots = await read('robots.txt')
ensure(/User-agent: \*\nAllow: \/\n/.test(robots) && robots.includes(`Sitemap: ${hostname}/sitemap.xml`) && !/Disallow: \/\S*/.test(robots), 'Crawl policy must allow public documentation and assets')
for (const path of ['llms.txt', 'zh/llms.txt', 'en/llms.txt']) {
  const text = await read(path)
  ensure(!/audit\/|\.vitepress\/|releases\/v2\.(2\.4|5\.2)/.test(text), `${path}: internal or retired content in discovery index`)
  const localLinks = [...text.matchAll(/\]\((https:\/\/docs\.xiaozhi\.me\/[^)]+)\)/g)].map(match => new URL(match[1]).pathname)
  for (const link of localLinks) await access(resolve(outDir, link.slice(1)))
  if (path !== 'llms.txt') ensure(localLinks.filter(url => url.endsWith('.md')).length === eligible.filter(page => page.path.startsWith(path.slice(0, 3))).length, `${path}: incomplete Markdown index`)
}
ensure(tags(await read('404.html'), 'meta').some(tag => tag.name === 'robots' && /noindex/.test(tag.content)), '404 must not be indexed')
console.log(`Discovery checks passed: ${urls.size} sitemap URLs; ${representations} clean Markdown copies; canonical/hreflang/JSON-LD verified; search and training crawlers allowed.`)
