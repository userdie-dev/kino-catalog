import { describe, expect, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'
import { useDebouncedRef } from './useDebouncedRef'

describe('useDebouncedRef', () => {
  it('starts with the source value', () => {
    const source = ref('initial')
    const debounced = useDebouncedRef(source, 200)
    expect(debounced.value).toBe('initial')
  })

  it('does not update immediately when the source changes', async () => {
    vi.useFakeTimers()
    const source = ref('a')
    const debounced = useDebouncedRef(source, 300)

    source.value = 'b'
    await nextTick()
    expect(debounced.value).toBe('a')

    vi.useRealTimers()
  })

  it('updates after the delay elapses', async () => {
    vi.useFakeTimers()
    const source = ref('a')
    const debounced = useDebouncedRef(source, 300)

    source.value = 'b'
    await nextTick()
    vi.advanceTimersByTime(300)
    expect(debounced.value).toBe('b')

    vi.useRealTimers()
  })

  it('resets the timer when the source changes again before the delay elapses', async () => {
    vi.useFakeTimers()
    const source = ref('a')
    const debounced = useDebouncedRef(source, 300)

    source.value = 'b'
    await nextTick()
    vi.advanceTimersByTime(200)
    source.value = 'c'
    await nextTick()
    vi.advanceTimersByTime(200)
    expect(debounced.value).toBe('a')

    vi.advanceTimersByTime(100)
    expect(debounced.value).toBe('c')

    vi.useRealTimers()
  })
})
