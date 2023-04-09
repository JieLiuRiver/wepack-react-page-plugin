import { extname, join, resolve } from 'path'
import { getPageFiles } from './files'
import { PageDirOptions, ResolvedOptions, ResolvedPage, ResolvedPages } from './types'
import { toArray, slash } from './utils'

function setPage(
  pages: ResolvedPages,
  pageDir: PageDirOptions,
  file: string,
  options: ResolvedOptions,
) {
  const component = slash(join(pageDir.dir, file))
  const filepath = slash(resolve(options.root, component))
  const extension = extname(file).slice(1)
  const customBlock = null

  pages.set(filepath, {
    dir: pageDir.dir,
    route: slash(join(pageDir.baseRoute, file.replace(options.extensionsRE, ''))),
    extension,
    filepath,
    component,
    customBlock,
  })
}

export function resolvePages(options: ResolvedOptions) {
  const dirs = toArray(options?.pagesDir || [])

  const pages = new Map<string, ResolvedPage>()

  const pageDirFiles = dirs.map((pageDir) => {
    const pagePath = slash(resolve(options.root, pageDir.dir))
    return {
      ...pageDir,
      files: getPageFiles(pagePath, options),
    }
  })

  for (const pageDir of pageDirFiles) {
    for (const file of pageDir.files)
      setPage(pages, pageDir, file, options)
  }

  const routes: string[] = []

  for (const page of pages.values()) {
    if (!routes.includes(page.route))
      routes.push(page.route)
    else
      throw new Error(`[webpack-react-pages-plugin] duplicate route in ${page.filepath}`)
  }

  return pages
}

function countSlash(value: string) {
  return (value.match(/\//g) || []).length
}

export function sortPages(pages: ResolvedPages) {
  return [...pages]
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .map(([_, value]) => value)
    .sort((a, b) => {
      return countSlash(a.route) - countSlash(b.route)
    })
}
