/// <reference types="hexo" />

import { once } from '@/utils'
import { exec } from 'node:child_process'

const isDev = !!~['s', 'server'].indexOf(hexo.env.cmd)
const isGenerate = !!~['g', 'generate'].indexOf(hexo.env.cmd)

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
  return css('css/uno.css')
})

const generateCss = async () => {
  if (isDev) {
    await generateCssWatch()
  }

  if (isGenerate) {
    await gerenateCssProduction()
  }
}

const gerenateCssProduction = () => {
  return new Promise((resolve) => {
    exec('npx unocss', () => {
      resolve(true)
    })
  })
}

const generateCssWatch = once(() => {
  return new Promise((resolve) => {
    exec(`npx unocss -w`, () => {
      resolve(true)
    })
  })
})
