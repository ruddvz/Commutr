import { escapeHtml } from '@/utils/dom'
import { renderButton } from '@/components/Button'

export function showLoading(container: HTMLElement, message = 'Loading…'): void {
  container.innerHTML = `
    <div class="cm-empty" role="status" aria-live="polite">
      <div class="cm-spinner" aria-hidden="true"></div>
      <p class="cm-body">${escapeHtml(message)}</p>
    </div>`
}

export function showEmpty(
  container: HTMLElement,
  opts: { title: string; body: string; actionLabel?: string; actionGo?: string },
): void {
  const action =
    opts.actionLabel && opts.actionGo
      ? renderButton(opts.actionLabel, { go: opts.actionGo, variant: 'primary' })
      : ''
  container.innerHTML = `
    <div class="cm-empty" role="status">
      <div class="cm-empty__icon" aria-hidden="true">🛣</div>
      <p class="cm-title-md">${escapeHtml(opts.title)}</p>
      <p class="cm-body cm-muted cm-mt-2">${escapeHtml(opts.body)}</p>
      ${action ? `<div class="cm-mt-4">${action}</div>` : ''}
    </div>`
}

export function showCompactReconnect(
  container: HTMLElement,
  opts: { title?: string; body: string; showRetry?: boolean },
): string {
  const html = `
    <div class="cm-reconnect-notice" role="status">
      <p class="cm-reconnect-notice__title">${escapeHtml(opts.title ?? "Couldn't reach live rides")}</p>
      <p class="cm-caption cm-muted">${escapeHtml(opts.body)}</p>
      ${opts.showRetry !== false ? renderButton('Try again', { variant: 'secondary', action: 'retry-last', size: 'sm' }) : ''}
    </div>`
  container.insertAdjacentHTML('afterbegin', html)
  return html
}

export function showError(container: HTMLElement, message: string): void {
  container.innerHTML = `
    <div class="cm-card cm-reconnect-card" role="alert">
      <p class="cm-reconnect-card__title">Live rides unavailable</p>
      <p class="cm-body cm-muted cm-mt-2">${escapeHtml(message)}</p>
      <p class="cm-caption cm-muted cm-mt-2">Showing saved or sample rides when available.</p>
      <div class="cm-mt-4">${renderButton('Retry', { variant: 'secondary', action: 'retry-last' })}</div>
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
  banner.textContent =
    "You're offline. Saved routes and recent messages are available. New actions will sync when you reconnect."
  document.body.prepend(banner)

  window.addEventListener('online', () => {
    banner.hidden = true
  })
  window.addEventListener('offline', () => {
    banner.hidden = false
  })
}
