import { describe, expect, it, vi } from 'vitest'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'

const getPopular = vi.fn()

vi.mock('tmdb-js-web', () => ({
  TMDBWebAPI: vi.fn().mockImplementation(function () {
    return {
      v3: {
        people: { getPopular }
      }
    }
  })
}))

mockNuxtImport('useRuntimeConfig', () => {
  return () => ({ public: { tmdbApiKey: 'test-key' } })
})

const { fetchTopRatedActors } = await import('./tmdb-client')

function person(id: number, ratings: number[]) {
  return {
    id,
    name: `Person ${id}`,
    profile_path: null,
    known_for: ratings.map(vote_average => ({ vote_average }))
  }
}

describe('fetchTopRatedActors', () => {
  it('re-ranks popular people by their average known-for rating', async () => {
    getPopular.mockResolvedValueOnce({
      results: [
        person(1, [5, 5]),
        person(2, [9, 9]),
        person(3, [7])
      ],
      page: 1,
      total_pages: 1
    })

    const result = await fetchTopRatedActors(1)

    expect(result.results.map(actor => actor.id)).toEqual([2, 3, 1])
  })

  it('treats people with no known-for ratings as rating 0', async () => {
    getPopular.mockResolvedValueOnce({
      results: [
        person(1, []),
        person(2, [3])
      ],
      page: 1,
      total_pages: 1
    })

    const result = await fetchTopRatedActors(1)

    expect(result.results.map(actor => actor.id)).toEqual([2, 1])
  })

  it('preserves pagination info from the response', async () => {
    getPopular.mockResolvedValueOnce({ results: [], page: 4, total_pages: 10 })

    const result = await fetchTopRatedActors(4)

    expect(result.page).toBe(4)
    expect(result.totalPages).toBe(10)
  })
})
