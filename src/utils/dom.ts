/**
 * DOM utility helpers — typed wrappers around common DOM queries.
 */

export function byId<T extends HTMLElement = HTMLElement>(id: string): T {
  const el = document.getElementById(id) as T | null
  if (!el) throw new Error(`Element #${id} not found`)
  return el
}

export function qsa<T extends Element = Element>(
  selector: string,
  root: Element | Document = document,
): T[] {
  return Array.from(root.querySelectorAll<T>(selector))
}

export function screenElement(name: string): HTMLElement {
  return byId(`s-${name}`)
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
