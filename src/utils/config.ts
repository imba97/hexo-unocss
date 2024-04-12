import { resolve } from 'node:path'

import { get } from '@/utils'

interface Config {
  /**
   * 是否开启插件
   */
  isEnabled: boolean
  /**
   * 是否开启插件
   */
  cssFile: string

  /**
   * 写入文件路径
   */
  writeCssFile: string

  /**
   * 文章目录监听路径
   */
  posts: string
}

const cssFile = get(hexo.config, 'unocss.file', 'css/uno.css')

export const config = <Config>{
  isEnabled: get(hexo.config, 'unocss.enabled', false),
  cssFile,
  writeCssFile: resolve(hexo.source_dir, cssFile),
  posts: get(hexo.config, 'unocss.posts', 'source/_posts')
}
