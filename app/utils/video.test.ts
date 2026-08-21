import { describe, expect, it } from 'vitest'
import { pickTrailer } from './video'
import type { Video } from '~/types/movie'

function makeVideo(overrides: Partial<Video>): Video {
  return {
    id: '1',
    key: 'key1',
    site: 'YouTube',
    type: 'Teaser',
    name: 'Video',
    ...overrides
  }
}

describe('pickTrailer', () => {
  it('picks the video with type Trailer', () => {
    const teaser = makeVideo({ id: '1', type: 'Teaser' })
    const trailer = makeVideo({ id: '2', type: 'Trailer' })
    expect(pickTrailer([teaser, trailer])).toBe(trailer)
  })

  it('falls back to the first video when there is no trailer', () => {
    const first = makeVideo({ id: '1', type: 'Teaser' })
    const second = makeVideo({ id: '2', type: 'Clip' })
    expect(pickTrailer([first, second])).toBe(first)
  })

  it('returns undefined for an empty list', () => {
    expect(pickTrailer([])).toBeUndefined()
  })

  it('prefers the trailer even when it is not first', () => {
    const clip = makeVideo({ id: '1', type: 'Clip' })
    const trailer = makeVideo({ id: '2', type: 'Trailer' })
    const teaser = makeVideo({ id: '3', type: 'Teaser' })
    expect(pickTrailer([clip, trailer, teaser])).toBe(trailer)
  })
})
