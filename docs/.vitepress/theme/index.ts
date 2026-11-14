import DefaultTheme from 'vitepress/theme'
import { h, onMounted, onUnmounted } from 'vue'
import LanguageRedirect from './LanguageRedirect.vue'
import PageNotice from './PageNotice.vue'
import PageFeedback from './PageFeedback.vue'
import SourceMaterials from './SourceMaterials.vue'
import CommunityLink from './CommunityLink.vue'
import { LANGUAGE_CHOICE_KEY } from './language-preference.mjs'
import './style.css'

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'doc-before': () => h(PageNotice),
      'doc-after': () => h(PageFeedback),
      'nav-bar-content-after': () => h(CommunityLink)
    })
  },
  enhanceApp({ app }) {
    app.component('LanguageRedirect', LanguageRedirect)
    app.component('SourceMaterials', SourceMaterials)
  },
  setup() {
    const rememberChoice = (event: MouseEvent) => {
      const link = event.target instanceof Element ? event.target.closest('a[href]') : null
      if (!link?.closest('.VPNavBarTranslations, .VPNavScreenTranslations, [data-language-choice]')) return
      const target = new URL(link.getAttribute('href')!, window.location.href)
      if (target.origin !== window.location.origin) return
      const locale = /^\/(zh|en)(?:\/|$)/.exec(target.pathname)?.[1]
      if (!locale) return
      try { localStorage.setItem(LANGUAGE_CHOICE_KEY, locale) } catch { /* Navigation still works. */ }
    }
    onMounted(() => document.addEventListener('click', rememberChoice, true))
    onUnmounted(() => document.removeEventListener('click', rememberChoice, true))
  }
}
