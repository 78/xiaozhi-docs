import { readFileSync, readdirSync } from 'node:fs'
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, extname, relative, resolve } from 'node:path'
import { createHash } from 'node:crypto'
import matter from 'gray-matter'
import { hostname, repositoryUrl, branch } from '../site.config.mjs'
import { publicImageUrl } from './public-images.mjs'

export const textLicense = 'https://creativecommons.org/licenses/by/4.0/'
export const licenseNotice = `${repositoryUrl}/blob/${branch}/LICENSE-DOCS`
export const pagePath = source => '/' + source.replace(/index\.md$/, '').replace(/\.md$/, '.html')
export const markdownPath = source => '/' + source
export const language = source => source.startsWith('zh/') ? 'zh-Hans' : 'en'

// Editorial review and crawler eligibility are independent. A complete guide may be indexed while awaiting feedback.
export function isIndexable(data) {
  const noindex = data.head?.some(tag => tag[0] === 'meta' && /^(robots|googlebot)$/i.test(tag[1]?.name || '') && /\bnoindex\b|\bnone\b/i.test(tag[1]?.content || ''))
  return ['review', 'published'].includes(data.status) && !data.redirectTo && !noindex
}

export function readDiscoveryPages(srcDir) {
  const pages = new Map()
  const walk = directory => {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const file = resolve(directory, entry.name)
      if (entry.isDirectory()) walk(file)
      else if (entry.name.endsWith('.md')) {
        const path = relative(srcDir, file).replaceAll('\\', '/')
        pages.set(path, { ...matter(readFileSync(file, 'utf8')), path, file })
      }
    }
  }
  for (const locale of ['zh', 'en']) walk(resolve(srcDir, locale))
  return pages
}

function absoluteLink(url, page, srcDir) {
  if (/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(url)) return url
  if (url.startsWith('#')) return hostname + pagePath(page.path) + url
  if (url.startsWith('/')) return hostname + url
  const image = publicImageUrl(url, page.file, resolve(srcDir, 'public'))
  if (image.startsWith('/images/')) return hostname + image
  const marker = url.search(/[?#]/)
  const path = marker < 0 ? url : url.slice(0, marker)
  const suffix = marker < 0 ? '' : url.slice(marker)
  const target = relative(srcDir, resolve(dirname(page.file), path)).replaceAll('\\', '/')
  if (/^(zh|en)\/.*\.md$/.test(target)) return hostname + pagePath(target) + suffix
  throw new Error(`${page.path}: unsupported discovery link ${url}`)
}

// Leave executable examples and inline code untouched while rewriting document/image links.
function rewriteProse(body, transform) {
  return body.split(/(^\s*```[^\n]*\n[^]*?^\s*```\s*$)/gm).map((block, index) => index % 2 ? block :
    block.split(/(`+[^`\n]+`+)/g).map((part, inline) => inline % 2 ? part : transform(part)).join('')).join('')
}

export function exportMarkdown(page, srcDir, materials, englishMaterials) {
  const zh = page.path.startsWith('zh/')
  let body = page.content.replace(/^<<<\s+([^\s]+)\s*$/gm, (_, input) => {
    const file = resolve(dirname(page.file), input)
    const example = relative(resolve(srcDir, '..', 'examples'), file)
    if (example.startsWith('..') || example.startsWith('/')) throw new Error('Only public examples may be embedded')
    const lang = extname(file) === '.py' ? 'python' : ''
    return `\n\`\`\`${lang}\n${readFileSync(file, 'utf8').trimEnd()}\n\`\`\`\n`
  })
  body = body.replace(/<SourceMaterials\b([^>]*)\/>/g, (_, attributes) => {
    const attr = name => new RegExp(`\\b${name}="([^"]+)"`).exec(attributes)?.[1]
    return (materials[attr('article')] || []).filter(item => (!attr('kind') || item.kind === attr('kind')) &&
      (!attr('only') || attr('only').split(',').includes(item.id))).map(item => {
      const labels = zh ? item : englishMaterials[item.id]
      return `- [${labels.label}](${item.url}) — ${item.name}; ${item.size} bytes; SHA-256: \`${item.sha256}\`. ${labels.note}`
    }).join('\n')
  })
  body = rewriteProse(body, prose => prose
    .replace(/<!--[^]*?-->/g, '')
    .replace(/\]\(([^)\n]+)\)/g, (_, url) => `](${absoluteLink(url, page, srcDir)})`)
    .replace(/^<a name="[^"]+"><\/a>\s*$/gm, '')
    .replace(/\s+\{#[^}]+\}(?=\s*$)/gm, '')
    .replace(/<\/?(?:figure|figcaption|div|details)\b[^>]*>/g, '')
    .replace(/<summary>([^]*?)<\/summary>/g, '\n**$1**\n')
    .replace(/<span id="[^"]+"><\/span>/g, '')
    .replace(/^::: (?:tip|warning|danger|info|details)\s*(.*)$/gm, (_, title) => `> **${title || (zh ? '说明' : 'Note')}**`)
    .replace(/^:::(?: code-group)?\s*$/gm, ''))
  if (page.data.layout === 'home' && (page.data.hero || page.data.features)) {
    body = `# ${page.data.title}\n\n${page.data.hero?.tagline || page.data.description}\n\n` +
      (page.data.features || []).map(feature => `- [${feature.title}](${hostname}${feature.link}): ${feature.details}`).join('\n') + '\n\n' + body
  }
  const review = page.data.status === 'review'
    ? (zh ? '> 社区校对中。适用版本、硬件条件与验证限制见正文。\n\n' : '> Community review. See the guide for applicable versions, hardware requirements, and verification limits.\n\n') : ''
  const stale = !zh && page.data.translation?.sourceHash && page.data.translation.sourceHash !==
    createHash('sha256').update(readFileSync(resolve(srcDir, page.path.replace(/^en\//, 'zh/')))).digest('hex')
  const translationNotice = stale ? `> The Chinese source has changed since this translation was reviewed. Compare the [current source](${hostname}${pagePath(page.path.replace(/^en\//, 'zh/'))}).\n\n` : ''
  const rights = zh
    ? `> 原创文字：[CC BY 4.0](${textLicense})，署名 XiaoZhi documentation contributors 并链接原文；第三方素材、代码和附件按各自许可。\n\n`
    : `> Original text: [CC BY 4.0](${textLicense}). Credit XiaoZhi documentation contributors and link to the original. Third-party media, code, and downloads retain their own terms.\n\n`
  const data = { title: page.data.title, description: page.data.description, lang: language(page.path), canonical: hostname + pagePath(page.path), status: page.data.status }
  if (page.data.reviewedAt) data.reviewedAt = page.data.reviewedAt
  if (page.data.archive) data.archive = true
  if (stale) data.translationStatus = 'needs-review'
  // Do not export contributor-only frontmatter, source IDs, or audit evidence.
  return matter.stringify(review + translationNotice + rights + body.trim() + '\n', data)
}

export async function writeDiscoveryFiles({ srcDir, outDir }) {
  const pages = [...readDiscoveryPages(srcDir).values()].filter(page => isIndexable(page.data)).sort((a, b) => a.path.localeCompare(b.path))
  const materials = JSON.parse(readFileSync(resolve(srcDir, '.vitepress/data/materials.json'), 'utf8'))
  const english = JSON.parse(readFileSync(resolve(srcDir, '.vitepress/data/materials.en.json'), 'utf8'))
  for (const page of pages) {
    const target = resolve(outDir, page.path)
    await mkdir(dirname(target), { recursive: true })
    await writeFile(target, exportMarkdown(page, srcDir, materials, english))
  }
  await writeFile(resolve(outDir, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${hostname}/sitemap.xml\n`)
  const about = `# XiaoZhi AI documentation\n\n> Tutorials for building, flashing, configuring, and extending XiaoZhi AI devices.\n\nOriginal documentation text is licensed under [CC BY 4.0](${textLicense}); [scope and attribution](${licenseNotice}). Third-party media, code, firmware, and downloads retain their own terms.\n\nUse the firmware version and hardware limits stated in each guide. Community-review pages are usable drafts, not claims of complete hardware verification. Historical firmware guides apply only to their stated versions.\n\n`
  for (const locale of ['zh', 'en']) {
    const selected = pages.filter(page => page.path.startsWith(locale + '/'))
    const groups = [selected.filter(page => !page.data.archive), selected.filter(page => page.data.archive)]
    const list = groups.map((group, index) => `## ${index ? 'Historical guides' : 'Guides'}\n\n` + group.map(page =>
      `- [${page.data.title}](${hostname}${markdownPath(page.path)}): ${page.data.description}`).join('\n')).join('\n\n')
    await writeFile(resolve(outDir, locale, 'llms.txt'), about + list + '\n')
  }
  const entryPaths = ['getting-started/index.md', 'hardware/index.md', 'firmware/index.md', 'console/index.md', 'mcp/index.md', 'development/index.md', 'reference/index.md', 'faq/index.md', 'community/index.md']
  const directory = ['## Complete language indexes', '', `- [English](${hostname}/en/llms.txt): All English guides in Markdown.`, `- [简体中文](${hostname}/zh/llms.txt): 全部中文教程的 Markdown 入口。`, '']
  for (const locale of ['en', 'zh']) {
    directory.push(`## ${locale === 'en' ? 'English' : '简体中文'}`, '')
    for (const path of entryPaths) {
      const page = pages.find(page => page.path === locale + '/' + path)
      if (page) directory.push(`- [${page.data.title}](${hostname}${markdownPath(page.path)}): ${page.data.description}`)
    }
    directory.push('')
  }
  await writeFile(resolve(outDir, 'llms.txt'), about + directory.join('\n'))
}
