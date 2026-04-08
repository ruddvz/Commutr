import { qsa } from '@/utils/dom'

/**
 * Toggle chip selection within a container (multi-select chips).
 * @param button - The chip button that was clicked
 * @param containerId - ID of the parent container element
 */
export function chipSel(button: HTMLElement, containerId: string): void {
  const container = document.getElementById(containerId)
  if (!container) return
  button.classList.toggle('active')
}

/**
 * Toggle segment button selection within the same segment group (single-select).
 */
export function segSel(button: HTMLElement): void {
  const parent = button.closest('.seg')
  if (!parent) return
  qsa<HTMLElement>('.segbtn', parent).forEach((btn) => btn.classList.remove('active'))
  button.classList.add('active')
}

/**
 * Increment/decrement a numeric stepper linked to a data-value attribute.
 */
export function stepChg(button: HTMLElement, delta: number): void {
  const target = button.closest('[data-stepper]')?.querySelector<HTMLElement>('[data-value]')
  if (!target) return
  const current = parseInt(target.dataset['value'] ?? '0', 10)
  const min = parseInt(target.dataset['min'] ?? '0', 10)
  const max = parseInt(target.dataset['max'] ?? '99', 10)
  const next = Math.max(min, Math.min(max, current + delta))
  target.dataset['value'] = String(next)
  target.textContent = String(next)
}
