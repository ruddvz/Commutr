import type { ScreenId } from '@/utils/router'
import {
  iconHome,
  iconMessages,
  iconPlus,
  iconProfile,
  iconSearch,
  iconBell,
  iconSettings,
} from './icons'

const TABS: Array<{ id: ScreenId; label: string; icon: () => string; primary?: boolean }> = [
  { id: 'home', label: 'Home', icon: iconHome },
  { id: 'search', label: 'Search', icon: iconSearch },
  { id: 'post', label: 'Post', icon: iconPlus, primary: true },
  { id: 'inbox', label: 'Messages', icon: iconMessages },
  { id: 'profile', label: 'Profile', icon: iconProfile },
]

function tabButton(tab: (typeof TABS)[number], active: ScreenId): string {
  const isActive = tab.id === active
  const cls = tab.primary ? 'cm-tab cm-tab--primary' : 'cm-tab'
  const wrapCls = tab.primary ? 'cm-tab-wrap cm-tab-wrap--primary' : 'cm-tab-wrap'
  return `
    <div class="${wrapCls}">
      <button type="button" class="${cls}" data-go="${tab.id}" role="tab" aria-current="${isActive ? 'page' : 'false'}">
        ${tab.icon()}
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
      <button type="button" class="cm-title-md" data-go="home" style="border:0;background:transparent;cursor:pointer;color:var(--cm-ink)">Commutr</button>
      <div class="cm-desktop-nav__links">${links}</div>
      <div class="cm-row">
        <button type="button" class="cm-icon-button" data-go="notifs" aria-label="Notifications">${iconBell()}</button>
        <button type="button" class="cm-icon-button" data-go="settings" aria-label="Settings">${iconSettings()}</button>
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

export { iconBell }
