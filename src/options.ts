import { resolve } from 'path'
import { slash, toArray } from '@antfu/utils'
import { getPageDirs } from './files'
import { ResolvedOptions, UserOptions } from './types'

function resolvePageDirs(pagesDir: UserOptions['pagesDir'], root: string, exclude: string[]) {
  pagesDir = toArray(pagesDir)
  return pagesDir.flatMap((pagesDir) => {
    const option = typeof pagesDir === 'string'
      ? { dir: pagesDir, baseRoute: '' }
      : pagesDir

    option.dir = slash(resolve(root, option.dir)).replace(`${root}/`, '')
    option.baseRoute = option.baseRoute.replace(/^\//, '').replace(/\/$/, '')

    return getPageDirs(option, root, exclude)
  })
}

export function resolveOptions(userOptions: UserOptions): ResolvedOptions {
  const {
    pagesDir = ['src/pages'],
    routeBlockLang = 'json5',
    exclude = [],
    syncIndex = true,
    replaceSquareBrackets = false,
    nuxtStyle = false,
    extendRoute,
    onRoutesGenerated,
    onClientGenerated,
  } = userOptions

  const root = slash(process.cwd())

  const importMode = 'sync'

  const extensions = ['tsx', 'jsx']

  const extensionsRE = new RegExp(`\\.(${extensions.join('|')})$`)

  const resolvedPagesDir = resolvePageDirs(pagesDir, root, exclude)

  const resolvedOptions: ResolvedOptions = {
    pagesDir: resolvedPagesDir,
    routeBlockLang,
    extensions,
    importMode,
    exclude,
    syncIndex,
    root,
    replaceSquareBrackets,
    nuxtStyle,
    extensionsRE,
    extendRoute,
    onRoutesGenerated,
    onClientGenerated,
  }

  return resolvedOptions
}
