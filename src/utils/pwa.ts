/**
 * Register the service worker with a base-path-aware scope (GitHub Pages /Commutr/).
 */
export function registerServiceWorker(): void {
  if (!('serviceWorker' in navigator)) return

  window.addEventListener('load', () => {
    const base = import.meta.env.BASE_URL
    navigator.serviceWorker.register(`${base}sw.js`, { scope: base }).catch((err: unknown) => {
      console.warn('Service worker registration failed:', err)
    })
  })
}
