import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  define: {
    'process.env': { TINY_MODE: 'pc' }
  },
  server: {
    host: '0.0.0.0',
    allowedHosts: ['.preview.with.woa.com', '.devnet-preview.with.woa.com'],
    proxy: {
      '/mcp': {
        target: 'http://localhost:3001',
        changeOrigin: true
      },
      '/chat': {
        target: 'http://localhost:3001',
        changeOrigin: true
      },
      '/health': {
        target: 'http://localhost:3001',
        changeOrigin: true
      }
    }
  }
})
