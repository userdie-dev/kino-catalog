import { beforeEach, describe, expect, it } from 'vitest'
import type { Movie } from '~/types/movie'
import { useSavedMovies } from './useSavedMovies'

function makeMovie(overrides: Partial<Movie> = {}): Movie {
  return {
    id: 1,
    title: 'Фильм',
    overview: 'Описание',
    posterPath: null,
    releaseDate: '2020-01-01',
    voteAverage: 7,
    ...overrides
  }
}

describe('useSavedMovies', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('starts with no saved movies when storage is empty', () => {
    const { savedMovies, isSaved } = useSavedMovies()
    expect(savedMovies.value.find(movie => movie.id === 999)).toBeUndefined()
    expect(isSaved(999)).toBe(false)
  })

  it('adds a movie on toggleSaved and persists it', () => {
    const { toggleSaved, isSaved } = useSavedMovies()
    const movie = makeMovie({ id: 42 })

    toggleSaved(movie)

    expect(isSaved(42)).toBe(true)
    const persisted = JSON.parse(localStorage.getItem('saved-movies') ?? '[]')
    expect(persisted.some((entry: Movie) => entry.id === 42)).toBe(true)
  })

  it('removes a movie on a second toggleSaved call', () => {
    const { toggleSaved, isSaved } = useSavedMovies()
    const movie = makeMovie({ id: 43 })

    toggleSaved(movie)
    toggleSaved(movie)

    expect(isSaved(43)).toBe(false)
  })

  it('removes a movie via removeSaved', () => {
    const { toggleSaved, removeSaved, isSaved } = useSavedMovies()
    const movie = makeMovie({ id: 44 })

    toggleSaved(movie)
    removeSaved(44)

    expect(isSaved(44)).toBe(false)
  })

  it('does nothing when removeSaved is called for an id that is not saved', () => {
    const { savedMovies, removeSaved } = useSavedMovies()
    const before = savedMovies.value.length

    removeSaved(12345)

    expect(savedMovies.value.length).toBe(before)
  })
})
