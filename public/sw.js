/* COMMUTR v5 - Service Worker
   Strategy: Cache-first for static assets, network-first for navigation
*/
const CACHE_NAME = 'commutr-v5-2'
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  'https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=DM+Mono:ital,wght@0,400;0,500&display=swap',
]

self.addEventListener('install', function (event) {
  self.skipWaiting()
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(
        STATIC_ASSETS.filter(function (url) {
          return !url.startsWith('https://')
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

  if (url.origin !== self.location.origin) return

  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(function () {
        return caches.match('/index.html')
      }),
    )
    return
  }

  event.respondWith(
    caches.match(event.request).then(function (cached) {
      if (cached) return cached
      return fetch(event.request).then(function (response) {
        if (!response || response.status !== 200 || response.type !== 'basic') return response
        var toCache = response.clone()
        caches.open(CACHE_NAME).then(function (cache) {
          cache.put(event.request, toCache)
        })
        return response
      })
    }),
  )
})
