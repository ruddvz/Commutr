import { escapeHtml } from '@/utils/dom'

export function renderAvatar(
  name: string,
  opts: { size?: 'md' | 'lg'; url?: string } = {},
): string {
  const initials = name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
  const sizeClass = opts.size === 'lg' ? ' cm-avatar--lg' : ''
  const img = opts.url ? `<img src="${escapeHtml(opts.url)}" alt="" />` : escapeHtml(initials)
  return `<div class="cm-avatar${sizeClass}" aria-hidden="true">${img}</div>`
}
