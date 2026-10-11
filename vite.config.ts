import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  // 静态站点直接部署到任意根路径或子路径，无需后端
  base: './',
})
