import { describe, expect, it, vi } from 'vitest'
import { effectScope, nextTick } from 'vue'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { useCatalogQuery } from './useCatalogQuery'

const replace = vi.fn()

mockNuxtImport('useRoute', () => {
  return () => ({ query: {} })
})

mockNuxtImport('useRouter', () => {
  return () => ({ replace })
})

function setupCatalogQuery(modes: string[] = ['popular', 'top-rated', 'search'], defaultMode = 'popular') {
  const scope = effectScope()
  const composable = scope.run(() => useCatalogQuery(modes, defaultMode))!
  return composable
}

describe('useCatalogQuery', () => {
  it('defaults to the given default mode and page 1', () => {
    const { mode, page, isSearching } = setupCatalogQuery()
    expect(mode.value).toBe('popular')
    expect(page.value).toBe(1)
    expect(isSearching.value).toBe(false)
  })

  it('marks isSearching true only in search mode', async () => {
    const { mode, isSearching } = setupCatalogQuery()
    mode.value = 'search'
    await nextTick()
    expect(isSearching.value).toBe(true)
  })

  it('resets page to 1 when mode changes', async () => {
    const { mode, page } = setupCatalogQuery()
    page.value = 3
    await nextTick()
    mode.value = 'top-rated'
    await nextTick()
    expect(page.value).toBe(1)
  })
})
