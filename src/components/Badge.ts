import { escapeHtml } from '@/utils/dom'

export function renderBadge(
  label: string,
  variant: 'default' | 'brand' | 'success' | 'warning' | 'danger' = 'default',
): string {
  const cls = variant === 'default' ? 'cm-badge' : `cm-badge cm-badge--${variant}`
  return `<span class="${cls}">${escapeHtml(label)}</span>`
}
