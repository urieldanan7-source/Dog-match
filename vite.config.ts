/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'איזה כלב מתאים לי',
        short_name: 'כלב מתאים',
        description: 'שאלון קצר שמראה אילו כלבים מתאימים לחיים שלכם, עם הטוב והרע של כל אחד.',
        lang: 'he', dir: 'rtl', display: 'standalone', start_url: '.',
        background_color: '#FBF3F1', theme_color: '#6B1A2C',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },
      // Models are large and fetched only on a breed page, so they are cached on first use, not up front.
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,woff2}', 'dogs/*.webp'],
        globIgnores: ['dogs/*_run.webp'],
        navigateFallback: 'index.html',
        runtimeCaching: [{ urlPattern: /\/dogs\/.*\.(glb|webp)$/, handler: 'CacheFirst', options: { cacheName: 'dogs', expiration: { maxEntries: 60 } } }],
      },
    }),
  ],
  build: { chunkSizeWarningLimit: 1200 },
  test: { environment: 'node', include: ['src/**/*.test.ts'] },
})
