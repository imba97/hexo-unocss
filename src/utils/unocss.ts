import fs from 'node:fs'
import unocss from 'unocss'
import { resolve } from 'node:path'

import { config } from '@/utils/config'

const generator = unocss.createGenerator({
  // TODO: configFile 不生效
  configFile: resolve(hexo.base_dir, 'uno.config.ts')
})

export const unocssGenerateCss = async (contentMap: Map<string, string>) => {
  const { css } = await generator.generate(new Set(contentMap.values()))
  fs.writeFileSync(config.writeCssFile, css)
}
