import { defineConfig, type HeadConfig } from 'vitepress'
import { readFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { fileURLToPath } from 'node:url'
import { repositoryUrl, branch, hostname } from '../../site.config.mjs'
import { sidebar } from './navigation'
import imageDimensions from './data/image-dimensions.json'
import { rootLanguageRedirectScript } from './theme/language-preference.mjs'

const localImageDimensions: Record<string, { width: number; height: number }> = imageDimensions

export default defineConfig({
  title: '小智文档',
  lang: 'zh-CN',
  description: '小智 AI 使用与开发文档 · XiaoZhi AI documentation',
  // The custom domain serves the site at /, rather than /xiaozhi-docs/.
  base: '/',
  // Keep .html URLs: they work on GitHub Pages without rewrite rules.
  cleanUrls: false,
  lastUpdated: true,
  markdown: {
    image: { lazyLoading: true },
    config(md) {
      const renderImage = md.renderer.rules.image!
      md.renderer.rules.image = (tokens, index, options, env, self) => {
        const token = tokens[index]
        const dimensions = localImageDimensions[token.attrGet('src') || '']
        if (dimensions) {
          // Reserve the full figure before lazy loading, so chapter links do not jump above the diagram.
          token.attrSet('width', String(dimensions.width))
          token.attrSet('height', String(dimensions.height))
        }
        return renderImage(tokens, index, options, env, self)
      }
    }
  },
  transformHead({ pageData }) {
    if (pageData.isNotFound) return []
    const path = pageData.relativePath.replace(/index\.md$/, '').replace(/\.md$/, '.html')
    const tags: HeadConfig[] = [
      ['link', { rel: 'canonical', href: `${hostname}/${path}` }]
    ]
    if (pageData.relativePath === 'index.md') {
      tags.push(['script', {}, rootLanguageRedirectScript('/')])
    }
    if (/^(zh|en)\//.test(path)) {
      for (const [locale, lang] of [['zh', 'zh-Hans'], ['en', 'en']]) {
        tags.push(['link', { rel: 'alternate', hreflang: lang, href: `${hostname}/${path.replace(/^(zh|en)\//, `${locale}/`)}` }])
      }
      tags.push(['link', { rel: 'alternate', hreflang: 'x-default', href: `${hostname}/` }])
    }
    return tags
  },
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
    ['meta', { name: 'theme-color', content: '#0d9488' }]
  ],
  locales: {
    zh: {
      label: '简体中文',
      lang: 'zh-Hans',
      title: '小智文档',
      description: '从第一次对话到开发自己的 AI 设备。',
      themeConfig: {
        nav: [
          { text: '开始使用', link: '/zh/getting-started/' },
          { text: '开发指南', link: '/zh/development/' },
          { text: '常见问题', link: '/zh/faq/' },
          { text: '控制台', link: 'https://xiaozhi.me/console/' }
        ],
        sidebar: sidebar('zh'),
        outline: { label: '本页内容', level: [2, 3] },
        editLink: { pattern: `${repositoryUrl}/edit/${branch}/docs/:path`, text: '在 GitHub 编辑此页' },
        lastUpdated: { text: '最后更新', formatOptions: { dateStyle: 'medium' } },
        docFooter: { prev: '上一篇', next: '下一篇' },
        darkModeSwitchLabel: '外观',
        lightModeSwitchTitle: '切换到浅色模式',
        darkModeSwitchTitle: '切换到深色模式',
        sidebarMenuLabel: '目录',
        returnToTopLabel: '回到顶部',
        langMenuLabel: '切换语言',
        skipToContentLabel: '跳转到正文',
        footer: { message: '由小智社区共同维护', copyright: 'XiaoZhi AI' }
      }
    },
    en: {
      label: 'English',
      lang: 'en',
      title: 'XiaoZhi Docs',
      description: 'From your first conversation to building your own AI device.',
      themeConfig: {
        nav: [
          { text: 'Get started', link: '/en/getting-started/' },
          { text: 'Development', link: '/en/development/' },
          { text: 'Troubleshooting', link: '/en/faq/' },
          { text: 'Console', link: 'https://xiaozhi.me/console/' }
        ],
        sidebar: sidebar('en'),
        outline: { label: 'On this page', level: [2, 3] },
        editLink: { pattern: `${repositoryUrl}/edit/${branch}/docs/:path`, text: 'Edit this page on GitHub' },
        footer: { message: 'Maintained by the XiaoZhi community', copyright: 'XiaoZhi AI' }
      }
    }
  },
  themeConfig: {
    logo: { src: '/logo.svg', alt: 'XiaoZhi' },
    socialLinks: [{ icon: 'github', link: repositoryUrl }],
    search: {
      provider: 'local',
      options: {
        async _render(src, env, md) {
          const html = md.render(src, env)
          return env.frontmatter?.status === 'draft' || env.frontmatter?.search === false ? '' : html
        },
        // Word segmentation is needed for Chinese queries in VitePress 1.x.
        miniSearch: {
          options: {
            tokenize(text) {
              return Array.from(new Intl.Segmenter('zh', { granularity: 'word' }).segment(text))
                .filter(segment => segment.isWordLike)
                .map(segment => segment.segment)
            }
          }
        },
        locales: {
          zh: {
            translations: {
              button: { buttonText: '搜索文档', buttonAriaLabel: '搜索文档' },
              modal: {
                noResultsText: '没有找到相关内容',
                resetButtonTitle: '清空搜索',
                backButtonTitle: '关闭搜索',
                displayDetails: '显示详细内容',
                footer: { selectText: '选择', navigateText: '切换', closeText: '关闭' }
              }
            }
          }
        }
      }
    }
  },
  transformPageData(page) {
    if (page.relativePath.startsWith('en/')) {
      const sourcePath = fileURLToPath(new URL(`../zh/${page.relativePath.slice(3)}`, import.meta.url))
      const hash = createHash('sha256').update(readFileSync(sourcePath)).digest('hex')
      page.frontmatter.translationStale = page.frontmatter.translation?.sourceHash !== hash
    }
    if (['draft', 'review'].includes(page.frontmatter.status)) {
      if (page.frontmatter.status === 'draft') page.frontmatter.search = false
      page.frontmatter.head ??= []
      page.frontmatter.head.push(['meta', { name: 'robots', content: 'noindex, follow' }])
    }
  }
})
