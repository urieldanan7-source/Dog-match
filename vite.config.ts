/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, type Plugin } from 'vite'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

/** Packs public/dogs into the bundle as data URLs for the one-file build, and to nothing otherwise. */
function packedDogs(pack: boolean): Plugin {
  const id = 'virtual:packed-dogs'
  const types: Record<string, string> = { glb: 'model/gltf-binary', webp: 'image/webp', mp4: 'video/mp4', jpg: 'image/jpeg' }
  const walk = (dir: string): string[] => readdirSync(dir).flatMap((f) => (statSync(join(dir, f)).isDirectory() ? walk(join(dir, f)) : [join(dir, f)]))
  return {
    name: 'packed-dogs',
    resolveId: (s) => (s === id ? '\0' + id : undefined),
    load(s) {
      if (s !== '\0' + id) return
      if (!pack) return 'export default {}'
      const root = join(__dirname, 'public/dogs')
      const map = Object.fromEntries(walk(root).filter((f) => types[f.split('.').pop()!]).map((f) => [relative(root, f).replaceAll('\\', '/'), `data:${types[f.split('.').pop()!]};base64,${readFileSync(f).toString('base64')}`]))
      return `export default ${JSON.stringify(map)}`
    },
  }
}
import { VitePWA } from 'vite-plugin-pwa'
import { viteSingleFile } from 'vite-plugin-singlefile'

export default defineConfig(({ mode }) => mode === 'single' ? {
  // One self-contained HTML file: npm run build:single -> dist-single/index.html
  plugins: [react(), tailwindcss(), packedDogs(true), viteSingleFile({ removeViteModuleLoader: true })],
  base: './',
  publicDir: false,
  build: { outDir: 'dist-single', assetsInlineLimit: () => true, chunkSizeWarningLimit: 100000 },
} : {
  plugins: [
    react(),
    tailwindcss(),
    packedDogs(false),
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
