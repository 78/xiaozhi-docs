import { readdir, readFile } from 'node:fs/promises'
import { resolve, relative } from 'node:path'
import { createHash } from 'node:crypto'
import matter from 'gray-matter'

export const root = resolve(import.meta.dirname, '..')
export const locales = ['zh', 'en']
export const sourceHash = raw => createHash('sha256').update(raw).digest('hex')

export async function readPages(locale) {
  const base = resolve(root, 'docs', locale)
  const pages = new Map()
  async function walk(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const path = resolve(directory, entry.name)
      if (entry.isDirectory()) await walk(path)
      else if (entry.isFile() && entry.name.endsWith('.md')) {
        const raw = await readFile(path, 'utf8')
        pages.set(relative(base, path).replaceAll('\\', '/'), { raw, ...matter(raw) })
      }
    }
  }
  await walk(base)
  return pages
}
