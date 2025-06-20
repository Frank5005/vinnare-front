import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
 
// https://vite.dev/config/
export default defineConfig({
  define: {
    'import.meta.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL),
  },
  plugins: [react(), tailwindcss()],
  server: {
    port: 8080,
    proxy: {
      '/api': {
        target: 'https://49b9-3-144-90-59.ngrok-free.app',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''), // Elimina /api del path
 
      },
    },
  },
})
