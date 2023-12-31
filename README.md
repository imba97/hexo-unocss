# hexo-unocss

支持在文章中使用 `unocss`

# 使用

安装插件和相关依赖（必选）

```bash
pnpm add hexo-unocss unocss @unocss/cli
```

安装 icon（可选）

```bash
pnpm add @iconify/json
```

# 配置

配置完全沿用 `unocss` 的配置

在根目录下新建 `uno.config.ts`

推荐配置

```typescript
import { defineConfig, presetUno, presetAttributify, presetIcons } from 'unocss'

export default defineConfig({
  presets: [presetUno(), presetAttributify(), presetIcons()],
  content: {
    pipeline: {
      include: [/\.(md)($|\?)/]
    }
  },
  cli: {
    entry: {
      patterns: ['source/**/*.md'],
      outFile: 'source/css/uno.css'
    }
  }
})
```
