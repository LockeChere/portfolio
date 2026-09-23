import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  // Relatieve paden, zodat de build in een submap van GitHub Pages werkt.
  base: './'
})
