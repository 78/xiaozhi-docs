// Only explicit choices use this key. The old key also recorded automatic visits.
export const LANGUAGE_CHOICE_KEY = 'xiaozhi-docs-language-choice'

export function preferredLocale(choice, languages = []) {
  if (choice === 'zh' || choice === 'en') return choice
  const codes = languages.map(language => String(language).trim().replaceAll('_', '-').toLowerCase())
  // Chinese is the source language; recognize it even behind Chrome's English fallback.
  if (codes.some(code => /^zh(?:-|$)/.test(code))) return 'zh'
  if (codes.some(code => /^en(?:-|$)/.test(code))) return 'en'
  return 'zh'
}

export function redirectToPreferredLanguage(browser, base = '/') {
  let choice = null
  try { choice = browser.localStorage.getItem(LANGUAGE_CHOICE_KEY) } catch { /* Use browser language. */ }
  const languages = browser.navigator.languages?.length
    ? browser.navigator.languages
    : [browser.navigator.language]
  const locale = preferredLocale(choice, languages)
  browser.location.replace(`${base}${locale}/${browser.location.search}${browser.location.hash}`)
}

// Run before the root page paints; reuse the same resolver for SPA navigation.
export function rootLanguageRedirectScript(base = '/') {
  return `(() => {const LANGUAGE_CHOICE_KEY = ${JSON.stringify(LANGUAGE_CHOICE_KEY)};${preferredLocale.toString()};${redirectToPreferredLanguage.toString()};redirectToPreferredLanguage(window, ${JSON.stringify(base)});})()`
}
