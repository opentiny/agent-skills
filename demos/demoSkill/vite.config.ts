import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    host: '0.0.0.0',
    allowedHosts: ['.preview.with.woa.com', '.devnet-preview.with.woa.com']
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})
