import { readPages, sourceHash } from './content.mjs'

const source = await readPages('zh')
const translated = await readPages('en')
let stale = 0
let pending = 0
for (const [path, page] of source) {
  if (translated.get(path)?.data.translation?.status === 'pending') {
    pending++
    console.log(`WAITING FOR CHINESE REVIEW en/${path}`)
    continue
  }
  const hash = sourceHash(page.raw)
  if (translated.get(path)?.data.translation?.sourceHash !== hash) {
    stale++
    console.log(`NEEDS REVIEW en/${path}\n  Chinese SHA-256: ${hash}`)
  }
}
console.log(`${source.size - stale - pending}/${source.size} English pages match the recorded Chinese revision; ${pending} translations pending Chinese review; ${stale} existing translations need review.`)
// Advisory: Chinese fixes may ship before their translations are ready.
// Only a human/translation PR may acknowledge a revision after reviewing it.
