/// <reference types="hexo" />

import { once } from '@/utils'
import { exec } from 'node:child_process'

const isDev = !!~['s', 'server'].indexOf(hexo.env.cmd)
const isGenerate = !!~['g', 'generate'].indexOf(hexo.env.cmd)

// hexo ready
hexo.on('ready', async () => {
  if (isDev || isGenerate) {
    gerenateCss()
  }
})

// hexo 文章渲染后
hexo.extend.filter.register('after_post_render', async (data) => {
  if (isDev) {
    gerenateCss()
  }

  return data
})

// 加载 uno.css
hexo.extend.injector.register('head_end', () => {
  const css = hexo.extend.helper.get('css').bind(hexo)
  return css('css/uno.css')
})

const gerenateCss = once(() => {
  exec(`npx unocss ${isDev ? '-w' : ''}`)
})
