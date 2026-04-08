import { describe, it, expect, beforeEach } from 'vitest'
import { JSDOM } from 'jsdom'

// Set up a minimal DOM for DOM utils under jsdom (already set by vitest config)
describe('byId', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="foo">Hello</div>'
  })

  it('returns the element for an existing id', async () => {
    const { byId } = await import('@/utils/dom')
    const el = byId('foo')
    expect(el).toBeTruthy()
    expect(el.textContent).toBe('Hello')
  })

  it('throws when the element does not exist', async () => {
    const { byId } = await import('@/utils/dom')
    expect(() => byId('nonexistent')).toThrow('Element #nonexistent not found')
  })
})

describe('escapeHtml', () => {
  it('escapes all dangerous characters', async () => {
    const { escapeHtml } = await import('@/utils/dom')
    expect(escapeHtml('<script>alert("xss")</script>')).toBe(
      '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;',
    )
  })

  it('is a no-op for safe text', async () => {
    const { escapeHtml } = await import('@/utils/dom')
    expect(escapeHtml('Hello World')).toBe('Hello World')
  })
})

describe('qsa', () => {
  beforeEach(() => {
    document.body.innerHTML = '<ul><li class="item">A</li><li class="item">B</li></ul>'
  })

  it('returns all matching elements as an array', async () => {
    const { qsa } = await import('@/utils/dom')
    const items = qsa('.item')
    expect(items).toHaveLength(2)
  })
})
