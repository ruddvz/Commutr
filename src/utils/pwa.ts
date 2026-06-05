/**
 * Register the service worker with a base-path-aware scope (GitHub Pages /Commutr/).
 */
import { showToast } from '@/components/toast'

export function registerServiceWorker(): void {
  if (!('serviceWorker' in navigator)) return

  window.addEventListener('load', () => {
    const base = import.meta.env.BASE_URL
    navigator.serviceWorker.register(`${base}sw.js`, { scope: base }).catch((err: unknown) => {
      console.warn('Service worker registration failed:', err)
    })
  })
}

export function initPwaUpdateToast(): void {
  if (!('serviceWorker' in navigator)) return

  navigator.serviceWorker.addEventListener('controllerchange', () => {
    showToast('Commutr updated — refresh for the latest version.')
  })

  navigator.serviceWorker.ready.then((registration) => {
    registration.addEventListener('updatefound', () => {
      const installing = registration.installing
      if (!installing) return
      installing.addEventListener('statechange', () => {
        if (installing.state === 'installed' && navigator.serviceWorker.controller) {
          showToast('Update available — tap to refresh.', 8000)
          document.getElementById('toast')?.addEventListener(
            'click',
            () => {
              window.location.reload()
            },
            { once: true },
          )
        }
      })
    })
  })
}
