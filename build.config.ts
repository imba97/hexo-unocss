import { resolve } from 'node:path'
import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: ['src/index'],
  clean: true,
  declaration: true,
  rollup: {
    emitCJS: true,
    alias: {
      entries: {
        '@': resolve(process.cwd(), 'src')
      }
    },
    esbuild: {
      minify: process.env.NODE_ENV === 'production'
    },
    inlineDependencies: true
  }
})
