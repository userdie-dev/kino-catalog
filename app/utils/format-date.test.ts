import { describe, expect, it } from 'vitest'
import { formatDate } from './format-date'

describe('formatDate', () => {
  it('formats an ISO date in Russian long form', () => {
    expect(formatDate('2023-11-05')).toBe('5 ноября 2023')
  })

  it('returns null fallback by default when date is null', () => {
    expect(formatDate(null)).toBeNull()
  })

  it('returns the provided fallback when date is null', () => {
    expect(formatDate(null, 'Неизвестно')).toBe('Неизвестно')
  })

  it('returns the provided fallback when date is an empty string', () => {
    expect(formatDate('', 'Неизвестно')).toBe('Неизвестно')
  })
})
