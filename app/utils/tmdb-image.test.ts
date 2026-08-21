import { describe, expect, it } from 'vitest'
import { backdropUrl, posterUrl, profileUrl } from './tmdb-image'

describe('posterUrl', () => {
  it('builds a poster URL with the default size', () => {
    expect(posterUrl('/abc.jpg')).toBe('https://image.tmdb.org/t/p/w342/abc.jpg')
  })

  it('builds a poster URL with a custom size', () => {
    expect(posterUrl('/abc.jpg', 'w500')).toBe('https://image.tmdb.org/t/p/w500/abc.jpg')
  })

  it('returns undefined when the path is null', () => {
    expect(posterUrl(null)).toBeUndefined()
  })
})

describe('profileUrl', () => {
  it('builds a profile URL with the default size', () => {
    expect(profileUrl('/actor.jpg')).toBe('https://image.tmdb.org/t/p/w185/actor.jpg')
  })

  it('builds a profile URL with a custom size', () => {
    expect(profileUrl('/actor.jpg', 'w342')).toBe('https://image.tmdb.org/t/p/w342/actor.jpg')
  })

  it('returns undefined when the path is null', () => {
    expect(profileUrl(null)).toBeUndefined()
  })
})

describe('backdropUrl', () => {
  it('builds a backdrop URL with the default size', () => {
    expect(backdropUrl('/scene.jpg')).toBe('https://image.tmdb.org/t/p/w1280/scene.jpg')
  })

  it('builds a backdrop URL with a custom size', () => {
    expect(backdropUrl('/scene.jpg', 'w780')).toBe('https://image.tmdb.org/t/p/w780/scene.jpg')
  })

  it('returns undefined when the path is null', () => {
    expect(backdropUrl(null)).toBeUndefined()
  })
})
