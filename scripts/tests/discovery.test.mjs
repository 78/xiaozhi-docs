import test from 'node:test'
import assert from 'node:assert/strict'
import { resolve } from 'node:path'
import { exportMarkdown, isIndexable } from '../discovery.mjs'

test('complete review guides can be indexed without changing editorial status', () => {
  assert.equal(isIndexable({ status: 'review' }), true)
  assert.equal(isIndexable({ status: 'published' }), true)
  for (const data of [
    { status: 'draft' }, {},
    { status: 'review', redirectTo: '/en/firmware/releases/v2.6.0.html' },
    { status: 'published', head: [['meta', { name: 'robots', content: 'noindex, follow' }]] },
    { status: 'published', head: [['meta', { name: 'googlebot', content: 'none' }]] }
  ]) assert.equal(isIndexable(data), false)
})

test('Markdown exports preserve code, expand attachments, and resolve nested image links', () => {
  const srcDir = resolve(import.meta.dirname, '../../docs')
  const code = '```md\n[Example](../do-not-rewrite.md)\n```'
  const page = {
    path: 'en/hardware/example.md', file: resolve(srcDir, 'en/hardware/example.md'),
    data: { title: 'Example', description: 'Test guide', status: 'review', sourceArticles: ['PRIVATE-ID'] },
    content: `# Example\n\n<!-- internal note -->\n\n[Step](../firmware/flashing.md?view=all#prepare)\n\n[![Wiring](../../public/images/en/gpio-led-wiring.svg)](../../public/images/en/gpio-led-wiring.svg)\n\n\`[Inline](../unchanged.md)\`\n\n${code}\n\n<SourceMaterials article="EXAMPLE" only="first" />`
  }
  const materials = { EXAMPLE: [
    { id: 'first', name: 'original.bin', kind: 'file', url: 'https://example.com/file.bin', size: 123, sha256: 'a'.repeat(64) },
    { id: 'second', name: 'excluded.bin', kind: 'file', url: 'https://example.com/other.bin' }
  ] }
  const result = exportMarkdown(page, srcDir, materials, { first: { label: 'Firmware example', note: 'For the stated version only.' } })
  assert.ok(result.includes(code))
  assert.ok(result.includes('`[Inline](../unchanged.md)`'))
  assert.ok(result.includes('https://docs.xiaozhi.me/en/firmware/flashing.html?view=all#prepare'))
  assert.equal(result.split('https://docs.xiaozhi.me/images/en/gpio-led-wiring.svg').length - 1, 2)
  assert.ok(result.includes('[Firmware example](https://example.com/file.bin)'))
  assert.ok(result.includes('For the stated version only.'))
  assert.ok(result.includes('Community review'))
  assert.ok(result.includes('Third-party media, code, and downloads retain their own terms.'))
  assert.ok(!/PRIVATE-ID|SourceMaterials|excluded\.bin|internal note/.test(result))
})
