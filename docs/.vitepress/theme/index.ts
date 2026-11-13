import DefaultTheme from 'vitepress/theme'
import { h, onMounted, watch } from 'vue'
import { useData } from 'vitepress'
import LanguageRedirect from './LanguageRedirect.vue'
import PageNotice from './PageNotice.vue'
import PageFeedback from './PageFeedback.vue'
import SourceMaterials from './SourceMaterials.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'doc-before': () => h(PageNotice),
      'doc-after': () => h(PageFeedback)
    })
  },
  enhanceApp({ app }) {
    app.component('LanguageRedirect', LanguageRedirect)
    app.component('SourceMaterials', SourceMaterials)
  },
  setup() {
    const { page } = useData()
    const rememberLanguage = () => {
      const locale = page.value.relativePath.split('/')[0]
      if (locale === 'zh' || locale === 'en') {
        try { localStorage.setItem('xiaozhi-docs-locale', locale) } catch { /* Storage may be blocked. */ }
      }
    }
    onMounted(() => {
      rememberLanguage()
      watch(() => page.value.relativePath, rememberLanguage)
    })
  }
}
