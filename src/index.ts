import fs from 'node:fs'
import unocss from 'unocss'
import { resolve } from 'node:path'
import { exec } from 'node:child_process'

import { get, once } from '@/utils'

const isDev = !!~['s', 'server'].indexOf(hexo.env.cmd)
const isGenerate = !!~['g', 'generate'].indexOf(hexo.env.cmd)

const generator = unocss.createGenerator()

/**
 * 是否开启插件
 */
const isEnabled: boolean = get(hexo.config, 'unocss.enabled', false)

/**
 * css 文件生成路径
 */
const cssFile: string = get(hexo.config, 'unocss.file', 'css/uno.css')

// hexo after init
hexo.extend.filter.register('after_init', async () => {
  await generateCss()
})

// hexo 文章渲染后
hexo.extend.filter.register('after_post_render', async (data) => {
  await generateCss()

  return data
})

// 加载 uno.css
hexo.extend.injector.register('head_end', () => {
  const css = hexo.extend.helper.get('css').bind(hexo)
  // hexo 生成 <link />
  return css(cssFile)
})

const generateCss = once(async () => {
  // 未开启
  if (!isEnabled) {
    const cssResolvePath = resolve(hexo.source_dir, cssFile)

    // 删除文件
    if (fs.existsSync(cssResolvePath)) {
      fs.unlinkSync(cssResolvePath)
    }

    return Promise.resolve(true)
  }

  if (!isDev && !isGenerate) {
    return Promise.resolve(true)
  }

  return new Promise((resolve) => {
    exec(`npx unocss ${isDev ? '-w' : ''}`, () => {
      resolve(true)
    })

    if (isDev) {
      resolve(true)
    }
  })
})
