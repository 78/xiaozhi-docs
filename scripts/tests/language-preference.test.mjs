import test from 'node:test'
import assert from 'node:assert/strict'
import { runInNewContext } from 'node:vm'
import {
  LANGUAGE_CHOICE_KEY, preferredLocale, redirectToPreferredLanguage, rootLanguageRedirectScript
} from '../../docs/.vitepress/theme/language-preference.mjs'

test('the first supported browser language wins, preserving the user preference order', () => {
  for (const language of ['zh', 'zh-CN', 'zh-Hans', 'zh-TW', 'zh-Hant-HK', 'zh_CN']) {
    assert.equal(preferredLocale(null, [language]), 'zh', language)
  }
  assert.equal(preferredLocale(null, ['en-US', 'zh-CN']), 'en')
  assert.equal(preferredLocale(null, ['zh-CN', 'en-US']), 'zh')
  assert.equal(preferredLocale(null, ['ja-JP', 'zh-CN', 'en-US']), 'zh')
  assert.equal(preferredLocale(null, ['ja-JP', 'en-US', 'zh-CN']), 'en')
  assert.equal(preferredLocale(null, ['ja-JP', 'en-GB']), 'en')
  assert.equal(preferredLocale(null, ['ja-JP']), 'zh')
  assert.equal(preferredLocale(null, []), 'zh')
})

test('only a valid explicit choice overrides browser language', () => {
  assert.equal(preferredLocale('en', ['zh-CN']), 'en')
  assert.equal(preferredLocale('zh', ['en-US']), 'zh')
  assert.equal(preferredLocale('invalid', ['zh-CN']), 'zh')
})

function fixture(values = {}, languages = ['zh-CN']) {
  const destinations = []
  const reads = []
  return {
    destinations, reads,
    browser: {
      localStorage: { getItem(key) { reads.push(key); return values[key] ?? null } },
      navigator: { languages, language: languages[0] },
      location: { search: '?from=home', hash: '#setup', replace(url) { destinations.push(url) } }
    }
  }
}

test('a historical automatic English visit no longer traps a Chinese browser', () => {
  const { browser, destinations, reads } = fixture({ 'xiaozhi-docs-locale': 'en' })
  redirectToPreferredLanguage(browser)
  assert.deepEqual(reads, [LANGUAGE_CHOICE_KEY])
  assert.deepEqual(destinations, ['/zh/?from=home#setup'])
})

test('remembered manual choice survives browser preferences and preserves URL suffixes', () => {
  const { browser, destinations } = fixture({ [LANGUAGE_CHOICE_KEY]: 'en' })
  redirectToPreferredLanguage(browser)
  assert.deepEqual(destinations, ['/en/?from=home#setup'])
})

test('blocked storage and missing languages list still route by navigator.language', () => {
  const { browser, destinations } = fixture()
  Object.defineProperty(browser, 'localStorage', { get() { throw new Error('Storage blocked') } })
  delete browser.navigator.languages
  redirectToPreferredLanguage(browser)
  assert.deepEqual(destinations, ['/zh/?from=home#setup'])
})

test('the early head script executes the same routing policy without app hydration', () => {
  for (const values of [{ 'xiaozhi-docs-locale': 'en' }, { [LANGUAGE_CHOICE_KEY]: 'en' }]) {
    const { browser, destinations } = fixture(values)
    runInNewContext(rootLanguageRedirectScript(), { window: browser })
    assert.deepEqual(destinations, [`/${values[LANGUAGE_CHOICE_KEY] || 'zh'}/?from=home#setup`])
  }
})
