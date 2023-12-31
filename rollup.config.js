import path from 'path'

import { defineConfig } from 'rollup'
import alias from '@rollup/plugin-alias'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import terser from '@rollup/plugin-terser'

const isDev = process.env.NODE_ENV === 'development'

export default defineConfig({
  input: 'build/index.js',
  output: {
    dir: 'dist',
    format: 'commonjs'
  },
  external: ['unocss'],
  plugins: [
    alias({
      entries: [
        {
          find: /^@/,
          replacement: path.resolve(path.resolve(__dirname), 'build')
        }
      ]
    }),
    resolve(),
    commonjs(),
    ...(!isDev ? [terser()] : [])
  ]
})
