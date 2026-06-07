/** Inline SVG icons — single icon language for the app shell. */

const svgAttrs =
  'xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"'

export function iconHome(): string {
  return `<svg ${svgAttrs} aria-hidden="true"><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5"/></svg>`
}

export function iconSearch(): string {
  return `<svg ${svgAttrs} aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>`
}

export function iconPlus(): string {
  return `<svg ${svgAttrs} aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>`
}

export function iconMessages(): string {
  return `<svg ${svgAttrs} aria-hidden="true"><path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5Z"/></svg>`
}

export function iconProfile(): string {
  return `<svg ${svgAttrs} aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 20a8 8 0 0 1 16 0"/></svg>`
}

export function iconBell(): string {
  return `<svg ${svgAttrs} aria-hidden="true"><path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></svg>`
}

export function iconBack(): string {
  return `<svg ${svgAttrs} aria-hidden="true"><path d="M15 18 9 12l6-6"/></svg>`
}

export function iconSettings(): string {
  return `<svg ${svgAttrs} aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/></svg>`
}

export function iconShield(): string {
  return `<svg ${svgAttrs} aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/></svg>`
}

export function iconRoute(): string {
  return `<svg ${svgAttrs} aria-hidden="true"><circle cx="6" cy="19" r="2"/><circle cx="18" cy="5" r="2"/><path d="M8 19V9a3 3 0 0 1 3-3h5"/></svg>`
}

export function iconCloudOff(): string {
  return `<svg ${svgAttrs} aria-hidden="true"><path d="m2 2 20 20"/><path d="M5.5 5.5A7 7 0 0 0 9 19h8.5a4.5 4.5 0 0 0 1.7-.34"/><path d="M8.5 8.5A4.5 4.5 0 0 1 18 10h.5"/></svg>`
}

export function iconFilter(): string {
  return `<svg ${svgAttrs} aria-hidden="true"><path d="M4 6h16M7 12h10M10 18h4"/></svg>`
}

export function iconShare(): string {
  return `<svg ${svgAttrs} aria-hidden="true"><path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7"/><path d="M12 16V4M8 8l4-4 4 4"/></svg>`
}

export function iconChevronRight(): string {
  return `<svg ${svgAttrs} aria-hidden="true"><path d="m9 6 6 6-6 6"/></svg>`
}

export function iconSend(): string {
  return `<svg ${svgAttrs} aria-hidden="true"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>`
}

export function iconCheck(): string {
  return `<svg ${svgAttrs} aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>`
}

export function iconInfo(): string {
  return `<svg ${svgAttrs} aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 10v6M12 7h.01"/></svg>`
}

export function iconStar(): string {
  return `<svg ${svgAttrs} aria-hidden="true"><path d="m12 2 3.1 6.3L22 9.3l-5 4.9 1.2 6.9L12 17.8l-6.2 3.3 1.2-6.9-5-4.9 6.9-1z"/></svg>`
}
