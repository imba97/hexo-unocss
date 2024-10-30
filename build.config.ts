import process from 'node:process'
import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: ['src/index'],
  outDir: './dist',
  clean: true,
  declaration: true,
  rollup: {
    emitCJS: true,
    esbuild: {
      minify: process.env.NODE_ENV === 'production'
    },
    inlineDependencies: true,
    commonjs: {
      requireReturnsDefault: 'auto'
    },
    dts: {
      respectExternal: false
    }
  }
})
