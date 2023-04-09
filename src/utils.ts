import { resolve, basename } from 'path'
import { toArray, slash } from '@antfu/utils'
import { ResolvedOptions, Route } from './types'
import type { OutputBundle } from 'rollup'

export { toArray, slash }

export const routeBlockCache = new Map<string, Record<string, any>>()

export function extensionsToGlob(extensions: string[]) {
  return extensions.length > 1 ? `{${extensions.join(',')}}` : extensions[0] || ''
}

function isPagesDir(path: string, options: ResolvedOptions) {
  for (const page of (options?.pagesDir || [])) {
    const dirPath = slash(resolve(options.root, page.dir))
    if (path.startsWith(dirPath)) return true
  }
  return false
}

export function isTarget(path: string, options: ResolvedOptions) {
  return isPagesDir(path, options) && options.extensionsRE.test(path)
}

const dynamicRouteRE = /^\[.+\]$/
export const nuxtDynamicRouteRE = /^_[\s\S]*$/

export function isDynamicRoute(routePath: string, nuxtStyle: Boolean = false) {
  return nuxtStyle
    ? nuxtDynamicRouteRE.test(routePath)
    : dynamicRouteRE.test(routePath)
}

export function isCatchAllRoute(routePath: string, nuxtStyle: Boolean = false) {
  return nuxtStyle
    ? /^_$/.test(routePath)
    : /^\[\.{3}/.test(routePath)
}

export function resolveImportMode(
  filepath: string,
  options: ResolvedOptions,
) {
  const mode = options.importMode
  if (typeof mode === 'function')
    return mode(filepath)

  for (const pageDir of (options?.pagesDir || [])) {
    if (
      options.syncIndex
      && pageDir.baseRoute === ''
      && filepath === `/${pageDir.dir}/index.tsx`
    )
      return 'sync'
  }
  return mode
}

export function pathToName(filepath: string) {
  return filepath.replace(/[_.\-\\/]/g, '_').replace(/[[:\]()]/g, '$')
}

export function findRouteByFilename(routes: Route[], filename: string): Route | null {
  let result = null
  for (const route of routes) {
    if (filename.endsWith(route.component))
      result = route

    if (!result && route.children)
      result = findRouteByFilename(route.children, filename)

    if (result) return result
  }
  return null
}

export function replaceSquareBrackets(bundle: OutputBundle) {
  const files = Object.keys(bundle).map(i => basename(i))
  for (const chunk of Object.values(bundle)) {
    chunk.fileName = chunk.fileName.replace(/(\[|\])/g, '_')
    if (chunk.type === 'chunk') {
      for (const file of files)
        chunk.code = chunk.code.replace(file, file.replace(/(\[|\])/g, '_'))
    }
  }
}
