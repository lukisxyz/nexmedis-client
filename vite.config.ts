import path from 'node:path'
import vue from '@vitejs/plugin-vue'
import autoprefixer from 'autoprefixer'
import tailwind from 'tailwindcss'
import { defineConfig } from 'vite'
import pluginRewriteAll from 'vite-plugin-rewrite-all'

export default defineConfig({
  css: {
    postcss: {
      plugins: [tailwind(), autoprefixer()],
    },
  },
  plugins: [vue(), pluginRewriteAll()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
