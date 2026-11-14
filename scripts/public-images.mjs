import { dirname, isAbsolute, relative, resolve, sep } from 'node:path'

// Markdown points at repository files; the website serves public/images at /images.
export function publicImageUrl(url, markdownFile, publicDirectory) {
  if (!url || !markdownFile || /^(?:\/|#|[a-z][a-z\d+.-]*:)/i.test(url)) return url
  const [, pathname, suffix = ''] = /^([^?#]*)(.*)$/.exec(url)
  const image = resolve(dirname(markdownFile), decodeURIComponent(pathname))
  const path = relative(resolve(publicDirectory, 'images'), image)
  if (!path || path === '..' || path.startsWith(`..${sep}`) || isAbsolute(path)) return url
  return '/images/' + path.split(sep).map(encodeURIComponent).join('/') + suffix
}
