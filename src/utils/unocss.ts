import fs from 'node:fs'

import unocss from 'unocss'
import { loadConfig } from 'unconfig'

import { config } from '@/utils/config'
import { IS_DEV } from '@/utils/constants'

import type { UserConfig } from 'unocss'

export const unocssGenerateCss = async (contentMap: Map<string, string>) => {
  const { config: unocssConfig } = await loadConfig<UserConfig>({
    sources: {
      files: ['unocss.config', 'uno.config']
    },
    cwd: hexo.base_dir
  })

  const generator = unocss.createGenerator(unocssConfig)

  const { css, matched } = await generator.generate([...contentMap].join(''))

  if (IS_DEV) {
    hexo.log.info(`UnoCSS matched ${[...matched].length}`)
  }

  fs.writeFileSync(config.writeCssFile, css, 'utf-8')
}
