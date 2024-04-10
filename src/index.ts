import fs from 'node:fs'
import Watcher from 'watcher'
import { resolve as pathResolve } from 'node:path'

import { once } from '@/utils'
import { readFiles } from '@/utils/fs'
import { config } from '@/utils/config'
import { unocssGenerateCss } from '@/utils/unocss'

const isDev = !!~['s', 'server'].indexOf(hexo.env.cmd)
const isGenerate = !!~['g', 'generate'].indexOf(hexo.env.cmd)

const contentMap: Map<string, string> = new Map()

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
  return css(config.cssFile)
})

const generateCss = once(async () => {
  // 未开启
  if (!config.isEnabled) {
    const cssResolvePath = pathResolve(hexo.source_dir, config.cssFile)

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
    const watcher = new Watcher(config.posts)

    watcher.on('ready', () => {
      hexo.log.info('UnoCSS Watcher started')

      const files = readFiles(config.posts)

      files.forEach((file) => {
        const fileResolvePath = pathResolve(hexo.base_dir, file)
        const content = fs.readFileSync(fileResolvePath, 'utf-8')
        contentMap.set(fileResolvePath, content)
      })

      resolve(true)
    })

    watcher.on('change', (path) => {
      contentMap.set(path, fs.readFileSync(path, 'utf-8'))
      unocssGenerateCss(contentMap)
    })

    if (isDev) {
      resolve(true)
    }
  })
})
