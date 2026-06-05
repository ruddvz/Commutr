/* COMMUTR v5 - Service Worker
   Strategy: cache-first static assets, network-first navigation & API
*/
const CACHE_VERSION = 'commutr-v6'
const STATIC_CACHE = `${CACHE_VERSION}-static`
const STATIC_ASSETS = ['./', './index.html', './manifest.json']

self.addEventListener('install', (event) => {
  self.skipWaiting()
  event.waitUntil(caches.open(STATIC_CACHE).then((cache) => cache.addAll(STATIC_ASSETS)))
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((key) => !key.startsWith(CACHE_VERSION)).map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)
  if (url.origin !== self.location.origin) return

  if (url.pathname.includes('/api/')) {
    event.respondWith(
      fetch(event.request).catch(() =>
        caches
          .match(event.request)
          .then((cached) => cached ?? new Response('{"error":"offline"}', { status: 503 })),
      ),
    )
    return
  }

  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request).catch(() => caches.match('./index.html')))
    return
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached
      return fetch(event.request).then((response) => {
        if (!response || response.status !== 200 || response.type !== 'basic') return response
        const clone = response.clone()
        caches.open(STATIC_CACHE).then((cache) => cache.put(event.request, clone))
        return response
      })
    }),
  )
})

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting()
})
