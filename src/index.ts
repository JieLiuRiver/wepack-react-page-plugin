import { RawSource } from 'webpack-sources'
import { ResolvedOptions, ResolvedPages, Route, UserOptions } from './types'
import { resolveOptions } from './options'
import { resolvePages } from './pages'
import { generateClientCode, generateRoutes } from './generate'
// import { generateRoutes } from './generate'
// import { resolvePages } from './pages'

export default class WebpackPagesPlugin {
  private generatedRoutes: Route[] | null = null
  userOptions: UserOptions | null = null
  options: ResolvedOptions | null = null
  pages: ResolvedPages | null = null

  constructor(options: UserOptions) {
    this.userOptions = options
  }

  apply(compiler: any) {
    compiler.hooks.compilation.tap('WebpackPagesPlugin', (compilation: any) => {
      this.options = resolveOptions(this.userOptions || {})
      this.pages = resolvePages(this.options)

      this.generatedRoutes = generateRoutes(this.pages, this.options)

      const clientCode = generateClientCode(this.generatedRoutes, this.options)

      compilation.assets['./static/js/generated-routes.js'] = new RawSource(clientCode)
    })
  }
}
