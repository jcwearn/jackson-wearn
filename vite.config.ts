import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      // /porchfest is its own HTML entry, not a route, so its share preview can
      // live in the served <head>. See porchfest/index.html.
      input: {
        main: 'index.html',
        porchfest: 'porchfest/index.html',
      },
    },
  },
})
