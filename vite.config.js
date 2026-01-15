// vite.config.js
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/ebay-api': {
        target: 'https://api.sandbox.ebay.com', // Proxy to eBay sandbox
        changeOrigin: true, // Changes the origin header to match target
        secure: false, // Allow self-signed certs if needed
        rewrite: path => path.replace(/^\/ebay-api/, ''), // Strip prefix
      },
    },
  },
})
