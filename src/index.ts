// import * as path from 'path'
// import * as glob from 'fast-glob'
import { UserOptions } from './types'
import { resolveOptions } from './options'

export default class WebpackPagesPlugin {
  options: UserOptions
  constructor(options: UserOptions) {
    this.options = options || {}
  }

  apply(compiler: any) {
    compiler.hooks.compilation.tap('WebpackPagesPlugin', (compilation: any) => {
      // 查找所有页面组件
      const pages = resolveOptions(this.options)
      // eslint-disable-next-line no-console
      console.log('pages', pages, 'compilation', compilation)

      // // 生成路由配置数组
      // const routes = generateRoutes(pages, this.options)

      // // 转换路由配置数组为 JavaScript 代码字符串
      // const clientCode = generateClientCode(routes, this.options)

      // // 将生成的代码添加到虚拟文件中
      // compilation.assets['generated-routes.js'] = {
      //   source: () => clientCode,
      //   size: () => clientCode.length,
      // }
    })
  }
}

// function generateRoutes(pages, options) {
//   // 实现类似于 generateRoutes 的逻辑
// }

// function generateClientCode(routes, options) {
//   // 实现类似于 generateClientCode 的逻辑
// }
