import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'  // ← Neu hinzufügen

export default defineConfig({
  plugins: [
    react(),  // ← Bestehend
    VitePWA({  // ← Neu hinzufügen
      registerType: 'autoUpdate',
      manifest: {
        name: 'Deine App',
        short_name: 'App',
        display: 'standalone',
        start_url: '/',
        theme_color: '#000000',
        background_color: '#ffffff',
        icons: [
          {
            src: 'icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  base: './',  // ← Deine bestehenden Settings bleiben!
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
})
