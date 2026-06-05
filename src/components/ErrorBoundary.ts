import { go } from '@/utils/router'
import { renderButton } from '@/components/Button'

let lastScreenRender: (() => void) | null = null

export function registerScreenRender(fn: () => void): void {
  lastScreenRender = fn
}

export function initErrorBoundary(): void {
  window.addEventListener('error', (event) => {
    if (import.meta.env.DEV) console.error(event.error)
    renderScreenError(event.message || 'Unexpected error')
  })

  window.addEventListener('unhandledrejection', (event) => {
    if (import.meta.env.DEV) console.error(event.reason)
    const message = event.reason instanceof Error ? event.reason.message : 'Something failed'
    renderScreenError(message)
  })
}

export function renderScreenError(message: string): void {
  const container = document.getElementById('appScreen')
  if (!container) return

  container.className = 'cm-screen'
  container.innerHTML = `
    <div class="cm-card cm-reconnect-card" role="alert">
      <p class="cm-reconnect-card__title">This screen had a problem</p>
      <p class="cm-body cm-muted cm-mt-2">${escape(message)}</p>
      <div class="cm-row cm-mt-4" style="gap:12px">
        ${renderButton('Go Home', { variant: 'primary', go: 'home' })}
        ${renderButton('Try again', { variant: 'secondary', action: 'screen-retry' })}
      </div>
    </div>`

  container.querySelector('[data-action="screen-retry"]')?.addEventListener('click', () => {
    if (lastScreenRender) lastScreenRender()
    else go('home')
  })
}

function escape(text: string): string {
  const el = document.createElement('span')
  el.textContent = text
  return el.innerHTML
}
