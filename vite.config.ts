import { defineConfig } from 'vite'
import { resolve } from 'path'
import { VitePWA } from 'vite-plugin-pwa'

const isGithubPages = process.env['GITHUB_PAGES'] === 'true'

export default defineConfig({
  base: isGithubPages ? '/Commutr/' : '/Commutr/',
  root: '.',
  publicDir: 'public',
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  plugins: [
    VitePWA({
      registerType: 'prompt',
      injectRegister: false,
      includeAssets: ['icons/*.svg'],
      manifest: {
        name: 'Commutr',
        short_name: 'Commutr',
        description:
          'Find intercity carpooling rides across Canada. Zero booking fees, verified drivers, and safer ride coordination.',
        theme_color: '#06120d',
        background_color: '#06120d',
        display: 'standalone',
        orientation: 'portrait-primary',
        lang: 'en-CA',
        categories: ['travel', 'lifestyle', 'navigation'],
        start_url: './',
        scope: './',
        icons: [
          {
            src: 'icons/icon-192.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
            purpose: 'any',
          },
          {
            src: 'icons/icon-512.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any',
          },
          {
            src: 'icons/icon-512.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'maskable',
          },
          {
            src: 'icons/apple-touch-icon.svg',
            sizes: '180x180',
            type: 'image/svg+xml',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,svg,woff2}'],
        navigateFallback: 'index.html',
        runtimeCaching: [
          {
            urlPattern: /\/api\//,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'commutr-api',
              networkTimeoutSeconds: 5,
              expiration: { maxEntries: 32, maxAgeSeconds: 300 },
            },
          },
        ],
      },
      devOptions: {
        enabled: false,
      },
    }),
  ],
  build: {
    outDir: 'dist/client',
    sourcemap: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
    },
  },
})
