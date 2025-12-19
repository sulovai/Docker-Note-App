import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,      // listen on 0.0.0.0
    port: 5173,      // same as docker-compose exposed port
    strictPort: true // prevent Vite from picking another port if 5173 is in use
  }
})
