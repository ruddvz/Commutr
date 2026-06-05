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

export function showError(container: HTMLElement, message: string): void {
  container.innerHTML = `
    <div class="cm-empty cm-empty--error" role="alert">
      <p class="cm-title-md">Something went wrong</p>
      <p class="cm-body cm-muted cm-mt-2">${escapeHtml(message)}</p>
      ${renderButton('Try again', { variant: 'outline', action: 'retry-last' })}
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
