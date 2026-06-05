import { escapeHtml } from '@/utils/dom'

export function renderChip(
  label: string,
  opts: {
    active?: boolean
    action?: string
    group?: string
    value?: string
    pressed?: boolean
  } = {},
): string {
  const active = opts.active || opts.pressed
  const attrs = [
    'type="button"',
    `class="cm-chip${active ? ' cm-chip--active' : ''}"`,
    active ? 'aria-pressed="true"' : 'aria-pressed="false"',
    opts.action ? `data-action="${opts.action}"` : '',
    opts.group ? `data-chip-group="${opts.group}"` : '',
    opts.value ? `data-chip-value="${escapeHtml(opts.value)}"` : '',
  ]
    .filter(Boolean)
    .join(' ')
  return `<button ${attrs}>${escapeHtml(label)}</button>`
}

export function renderChipRow(chips: string): string {
  return `<div class="cm-chip-row">${chips}</div>`
}
