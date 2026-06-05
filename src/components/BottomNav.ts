import type { ScreenId } from '@/utils/router'

const TABS: Array<{ id: ScreenId; label: string; icon: string; primary?: boolean }> = [
  { id: 'home', label: 'Home', icon: '⌂' },
  { id: 'search', label: 'Search', icon: '⌕' },
  { id: 'post', label: 'Post', icon: '+', primary: true },
  { id: 'inbox', label: 'Messages', icon: '💬' },
  { id: 'profile', label: 'Profile', icon: '👤' },
]

function tabButton(tab: (typeof TABS)[number], active: ScreenId): string {
  const isActive = tab.id === active
  const cls = tab.primary ? 'cm-tab cm-tab--primary' : 'cm-tab'
  return `
    <div class="cm-tab-wrap">
      <button type="button" class="${cls}" data-go="${tab.id}" aria-current="${isActive ? 'page' : 'false'}">
        <span aria-hidden="true">${tab.icon}</span>
        <span>${tab.label}</span>
      </button>
    </div>`
}

export function renderBottomNav(active: ScreenId): string {
  return `
    <nav id="appBottomNav" class="cm-bottom-nav" aria-label="Primary">
      ${TABS.map((t) => tabButton(t, active)).join('')}
    </nav>`
}

export function mountBottomNav(active: ScreenId): void {
  const el = document.getElementById('appBottomNav')
  if (!el) return
  el.outerHTML = renderBottomNav(active)
}

export function renderDesktopNav(active: ScreenId): string {
  const links = TABS.filter((t) => t.id !== 'profile')
    .map((t) => {
      const cls = t.id === active ? 'cm-chip cm-chip--active' : 'cm-chip'
      return `<button type="button" class="${cls}" data-go="${t.id}">${t.label}</button>`
    })
    .join('')
  return `
    <nav class="cm-desktop-nav" aria-label="Desktop">
      <button type="button" class="cm-title-md" data-go="home" style="border:0;background:transparent;cursor:pointer;color:var(--cm-brand-strong)">COMMUTR</button>
      <div class="cm-desktop-nav__links">${links}</div>
      <div class="cm-row">
        <button type="button" class="cm-icon-button" data-go="notifs" aria-label="Notifications">🔔</button>
        <button type="button" class="cm-avatar" data-go="profile" aria-label="Profile">RK</button>
      </div>
    </nav>`
}

export function mountDesktopNav(active: ScreenId): void {
  let el = document.querySelector('.cm-desktop-nav')
  if (!el) {
    const shell = document.getElementById('app')
    if (!shell) return
    const nav = document.createElement('div')
    nav.innerHTML = renderDesktopNav(active)
    shell.prepend(nav.firstElementChild!)
    el = document.querySelector('.cm-desktop-nav')
  } else {
    el.outerHTML = renderDesktopNav(active)
  }
}
