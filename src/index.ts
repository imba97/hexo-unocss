import fs from 'node:fs'
import { watch } from 'chokidar'
import { resolve as pathResolve } from 'node:path'

import { once } from '@/utils'
import { readFiles } from '@/utils/fs'
import { config } from '@/utils/config'
import { unocssGenerateCss } from '@/utils/unocss'
import { IS_DEV, IS_GENERATE } from '@/utils/constants'

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

/**
 * UnoCSS 初始化
 */
const unocssInitialization = async () => {
  const files = readFiles(config.posts)

  files.forEach((file) => {
    const content = fs.readFileSync(file, 'utf-8')
    contentMap.set(file, content)
  })

  await unocssGenerateCss(contentMap)
}

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

  if (!IS_DEV && !IS_GENERATE) {
    return Promise.resolve(true)
  }

  if (IS_GENERATE) {
    return unocssInitialization()
  }

  return new Promise((resolve) => {
    const watcher = watch(config.posts)

    // 监听文件初始化
    watcher.on('ready', async () => {
      await unocssInitialization()
      hexo.log.info('UnoCSS Watcher started')

      resolve(true)
    })

    // 监听文件修改
    watcher.on('change', (path) => {
      contentMap.set(path, fs.readFileSync(path, 'utf-8'))
      unocssGenerateCss(contentMap)
    })

    // 监听文件删除
    watcher.on('unlink', (path) => {
      if (!contentMap.has(path)) {
        return
      }

      contentMap.delete(path)
      unocssGenerateCss(contentMap)
    })
  })
})
