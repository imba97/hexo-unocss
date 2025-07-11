import { exec } from 'node:child_process'
import fs from 'node:fs'
import { createRequire } from 'node:module'
import { resolve as pathResolve } from 'node:path'

import { once } from './utils'
import { config } from './utils/config'
import { IS_DEV, IS_GENERATE } from './utils/constants'

const require = createRequire(import.meta.url)

const generateCss = once(async () => {
  // 未开启
  if (!config.isEnable) {
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

  const files = Array.isArray(config.patterns)
    ? config.patterns.map(path => `"${path}"`).join(' ')
    : config.patterns

  return new Promise((resolve) => {
    hexo.log.info('Start UnoCSS!')

    const cliIndex = require.resolve('@unocss/cli')
    const cli = pathResolve(cliIndex, '..', '..', 'bin', 'unocss.mjs')
    const command = `node ${cli} ${files} -o "${config.writeCssFile}" ${IS_DEV ? '-w' : '-m'}`

    exec(command, () => {
      resolve(true)
    })

    if (IS_DEV) {
      resolve(true)
    }
  })
})

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
  if (!config.isEnable) {
    return ''
  }

  const css = hexo.extend.helper.get('css').bind(hexo)
  // hexo 生成 <link />
  return css(`${config.cssFile}?t=${new Date().getTime()}`)
})
