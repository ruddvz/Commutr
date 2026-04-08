import { describe, it, expect } from 'vitest'
import { formatDate, formatTime, formatCAD, formatDuration } from '@/utils/format'

describe('formatCAD', () => {
  it('formats whole-dollar amounts without cents', () => {
    expect(formatCAD(25)).toBe('$25')
  })

  it('formats amounts with cents', () => {
    expect(formatCAD(12.5)).toBe('$12.50')
  })
})

describe('formatDuration', () => {
  it('formats minutes only', () => {
    expect(formatDuration(45)).toBe('45m')
  })

  it('formats hours only', () => {
    expect(formatDuration(120)).toBe('2h')
  })

  it('formats hours and minutes', () => {
    expect(formatDuration(90)).toBe('1h 30m')
  })
})
