/* COMMUTR v5 - Service Worker
   Strategy: Cache-first for static assets, network-first for navigation
*/
const CACHE_NAME = 'commutr-v5-1'
const STATIC_ASSETS = [
  '/Commutr/',
  '/Commutr/index.html',
  '/Commutr/style.css',
  '/Commutr/app.js',
  '/Commutr/manifest.json',
  'https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=DM+Mono:ital,wght@0,400;0,500&display=swap',
]

self.addEventListener('install', function (event) {
  self.skipWaiting()
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(
        STATIC_ASSETS.filter(function (url) {
          return !url.startsWith('https://fonts.')
        }),
      )
    }),
  )
})

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches
      .keys()
      .then(function (keys) {
        return Promise.all(
          keys
            .filter(function (key) {
              return key !== CACHE_NAME
            })
            .map(function (key) {
              return caches.delete(key)
            }),
        )
      })
      .then(function () {
        return self.clients.claim()
      }),
  )
})

self.addEventListener('fetch', function (event) {
  var url = new URL(event.request.url)

  // Always go to network for cross-origin (Google Fonts etc.)
  if (url.origin !== self.location.origin) {
    return
  }

  // Navigation: network-first, fall back to cached index.html
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(function () {
        return caches.match('/Commutr/index.html')
      }),
    )
    return
  }

  // Static assets: cache-first
  event.respondWith(
    caches.match(event.request).then(function (cached) {
      if (cached) return cached
      return fetch(event.request).then(function (response) {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response
        }
        var toCache = response.clone()
        caches.open(CACHE_NAME).then(function (cache) {
          cache.put(event.request, toCache)
        })
        return response
      })
    }),
  )
})
