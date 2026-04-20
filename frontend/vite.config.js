import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/xyz/',
  plugins: [react()],
  server: {
    allowedHosts: true,
    proxy: {
      '/xyz/backend/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/xyz\/backend\/api/, '/api'),
      },
    },
  },
})
