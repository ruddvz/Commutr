import { escapeHtml } from '@/utils/dom'

export function renderInputField(opts: {
  id: string
  label: string
  type?: string
  value?: string
  placeholder?: string
  helper?: string
  error?: string
  inputMode?: string
  autocomplete?: string
  min?: string
  max?: string
  variant?: 'default' | 'dark'
}): string {
  const errorHtml = opts.error
    ? `<p class="cm-field-error" role="alert">${escapeHtml(opts.error)}</p>`
    : ''
  const helperHtml = opts.helper ? `<p class="cm-helper">${escapeHtml(opts.helper)}</p>` : ''
  const inputClass = opts.variant === 'dark' ? 'cm-input cm-input--dark' : 'cm-input'
  const labelClass = opts.variant === 'dark' ? 'cm-label cm-label--on-glass' : 'cm-label'
  const inputAttrs = [
    `id="${opts.id}"`,
    `name="${opts.id}"`,
    `type="${opts.type ?? 'text'}"`,
    `class="${inputClass}"`,
    opts.value ? `value="${escapeHtml(opts.value)}"` : '',
    opts.placeholder ? `placeholder="${escapeHtml(opts.placeholder)}"` : '',
    opts.inputMode ? `inputmode="${opts.inputMode}"` : '',
    opts.autocomplete ? `autocomplete="${opts.autocomplete}"` : '',
    opts.min ? `min="${opts.min}"` : '',
    opts.max ? `max="${opts.max}"` : '',
    opts.error ? 'aria-invalid="true"' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return `
    <div class="cm-field">
      <label class="${labelClass}" for="${opts.id}">${escapeHtml(opts.label)}</label>
      ${helperHtml}
      <input ${inputAttrs} />
      ${errorHtml}
    </div>`
}

export function renderTextareaField(opts: {
  id: string
  label: string
  placeholder?: string
  helper?: string
}): string {
  const helperHtml = opts.helper ? `<p class="cm-helper">${escapeHtml(opts.helper)}</p>` : ''
  return `
    <div class="cm-field">
      <label class="cm-label" for="${opts.id}">${escapeHtml(opts.label)}</label>
      ${helperHtml}
      <textarea id="${opts.id}" name="${opts.id}" class="cm-input cm-textarea" placeholder="${escapeHtml(opts.placeholder ?? '')}"></textarea>
    </div>`
}
