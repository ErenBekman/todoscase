import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  publicDir: './public',
  server:{
    port: 3000,
    proxy: {
      '/api': {
          target: 'http://localhost:8080/api',
          changeOrigin: true,
          secure: false
      }
    }
  },
  plugins: [
    react()
  ],
})
