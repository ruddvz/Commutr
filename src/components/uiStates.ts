import { escapeHtml } from '@/utils/dom'

export function showLoading(container: HTMLElement, message = 'Loading…'): void {
  container.innerHTML = `
    <div class="cm-empty" role="status" aria-live="polite">
      <div class="cm-spinner" aria-hidden="true"></div>
      <p>${escapeHtml(message)}</p>
    </div>`
}

export function showEmpty(
  container: HTMLElement,
  opts: { title: string; body: string; actionLabel?: string; actionGo?: string },
): void {
  const action =
    opts.actionLabel && opts.actionGo
      ? `<button type="button" class="btn" data-go="${escapeHtml(opts.actionGo)}">${escapeHtml(opts.actionLabel)}</button>`
      : ''
  container.innerHTML = `
    <div class="cm-empty" role="status">
      <p class="th3">${escapeHtml(opts.title)}</p>
      <p class="tb2">${escapeHtml(opts.body)}</p>
      ${action}
    </div>`
}

export function showError(container: HTMLElement, message: string): void {
  container.innerHTML = `
    <div class="cm-empty cm-empty--error" role="alert">
      <p class="th3">Something went wrong</p>
      <p class="tb2">${escapeHtml(message)}</p>
      <button type="button" class="btn2" data-action="retry-last">Try again</button>
    </div>`
}

export function mountOfflineBanner(): void {
  if (document.getElementById('cm-offline-banner')) return
  const banner = document.createElement('div')
  banner.id = 'cm-offline-banner'
  banner.className = 'cm-offline-banner'
  banner.setAttribute('role', 'status')
  banner.setAttribute('aria-live', 'polite')
  banner.hidden = navigator.onLine
  banner.textContent = 'You are offline. Some actions will sync when you reconnect.'
  document.body.prepend(banner)

  window.addEventListener('online', () => {
    banner.hidden = true
  })
  window.addEventListener('offline', () => {
    banner.hidden = false
  })
}
