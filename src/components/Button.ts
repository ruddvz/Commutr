export function renderButton(
  label: string,
  opts: {
    variant?: 'primary' | 'secondary' | 'outline' | 'tertiary' | 'danger'
    block?: boolean
    type?: 'button' | 'submit'
    action?: string
    go?: string
    id?: string
    disabled?: boolean
    size?: 'sm' | 'md'
  } = {},
): string {
  const variant = opts.variant ?? 'primary'
  const classes = [
    'cm-button',
    `cm-button--${variant}`,
    opts.block ? 'cm-button--block' : '',
    opts.size === 'sm' ? 'cm-button--sm' : '',
  ]
    .filter(Boolean)
    .join(' ')
  const attrs = [
    `type="${opts.type ?? 'button'}"`,
    `class="${classes}"`,
    opts.id ? `id="${opts.id}"` : '',
    opts.action ? `data-action="${opts.action}"` : '',
    opts.go ? `data-go="${opts.go}"` : '',
    opts.disabled ? 'disabled' : '',
  ]
    .filter(Boolean)
    .join(' ')
  return `<button ${attrs}>${label}</button>`
}

export function renderIconButton(
  label: string,
  opts: { action?: string; go?: string; id?: string } = {},
): string {
  const attrs = [
    'type="button"',
    'class="cm-icon-button cm-focus-ring"',
    `aria-label="${label}"`,
    opts.id ? `id="${opts.id}"` : '',
    opts.action ? `data-action="${opts.action}"` : '',
    opts.go ? `data-go="${opts.go}"` : '',
  ]
    .filter(Boolean)
    .join(' ')
  return `<button ${attrs}>${label}</button>`
}
