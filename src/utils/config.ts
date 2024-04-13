import { resolve } from 'node:path'

import { get } from '@/utils'

interface Config {
  /**
   * 是否开启插件
   */
  isEnabled: boolean

  /**
   * css 文件
   */
  cssFile: string

  /**
   * 写入文件路径
   */
  writeCssFile: string

  /**
   * 文章路径
   */
  patterns: string
}

const cssFile = get(hexo.config, 'unocss.file', 'css/uno.css')

export const config = <Config>{
  isEnabled: get(hexo.config, 'unocss.enabled', false),
  cssFile,
  writeCssFile: resolve(hexo.source_dir, cssFile),
  patterns: get(hexo.config, 'unocss.patterns', 'source/**/*.md')
}
