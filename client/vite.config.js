import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Any request starting with /api will be forwarded to the backend
      '/api': {
        target: 'http://localhost:3000', // Your Express server's address
        changeOrigin: true, // This is needed for the proxy to work correctly
      },
    },
  },
})