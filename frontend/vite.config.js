import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// User site de GitHub Pages: repositorio valeriaecheverry21 -> https://valeriaecheverry21.github.io/
const repo = '/'

export default defineConfig({
  plugins: [react()],
  base: repo,
  server: {
    proxy: {
      // Redirige las peticiones /api al backend de Go en desarrollo
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})
