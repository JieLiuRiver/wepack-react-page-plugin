import JSON5 from 'json5'
import YAML from 'yaml'

import type { ResolvedOptions } from './types'

export function parseCustomBlock(block: any, filePath: string, options: ResolvedOptions): any {
  const lang = block.lang ?? options.routeBlockLang

  if (lang === 'json5') {
    try {
      return JSON5.parse(block.content)
    } catch (err: any) {
      throw new Error(`Invalid JSON5 format of <${block.type}> content in ${filePath}\n${err.message}`)
    }
  } else if (lang === 'json') {
    try {
      return JSON.parse(block.content)
    } catch (err: any) {
      throw new Error(`Invalid JSON format of <${block.type}> content in ${filePath}\n${err.message}`)
    }
  } else if (lang === 'yaml' || lang === 'yml') {
    try {
      return YAML.parse(block.content)
    } catch (err: any) {
      throw new Error(`Invalid YAML format of <${block.type}> content in ${filePath}\n${err.message}`)
    }
  }
}
