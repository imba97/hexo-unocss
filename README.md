# hexo-unocss

支持在文章中使用 UnoCSS

查看 [Demo](https://imba97.cn/archives/775/)

# 使用

## 安装依赖

安装插件和 UnoCSS

```bash
npm install hexo-unocss unocss
```

## 使用图标（可选）

全量安装图标库

```bash
npm install @iconify/json
```

图标站：[Icônes](https://icones.js.org/)

# 配置

## 插件配置

```yml
unocss:
  # 是否启用
  enable: true

  # 生成的样式文件
  # 以 source 为根目录
  file: css/uno.css

  # 扫描文件
  patterns:
    - 'source/**/*.md'
```

## UnoCSS 配置

配置完全沿用 UnoCSS 的配置，详情请参考 [https://unocss.dev/config/](https://unocss.dev/config/)

在根目录下新建 `uno.config.ts`，推荐以下配置。包含基础写法、属性写法、icon 的预设配置

```typescript
import { defineConfig, presetAttributify, presetIcons, presetUno } from 'unocss'

export default defineConfig({
  presets: [presetUno(), presetAttributify(), presetIcons()],
  content: {
    pipeline: {
      include: [/\.(md)($|\?)/]
    }
  }
})
```
