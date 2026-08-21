import { describe, expect, it } from 'vitest'
import {
  mapActor,
  mapActorDetails,
  mapMovie,
  mapMovieDetails,
  mapTVShow,
  mapTVShowDetails,
  toPaginatedActors,
  toPaginatedMovies,
  toPaginatedTVShows,
  type RawActorDetails,
  type RawMovie,
  type RawMovieDetails,
  type RawTVShowDetails
} from './tmdb-map'

const rawMovie: RawMovie = {
  id: 1,
  title: 'Начало',
  overview: 'Сон во сне',
  poster_path: '/poster.jpg',
  release_date: '2010-07-16',
  vote_average: 8.8
}

describe('mapMovie', () => {
  it('converts snake_case fields to camelCase', () => {
    expect(mapMovie(rawMovie)).toEqual({
      id: 1,
      title: 'Начало',
      overview: 'Сон во сне',
      posterPath: '/poster.jpg',
      releaseDate: '2010-07-16',
      voteAverage: 8.8
    })
  })
})

describe('toPaginatedMovies', () => {
  it('maps results and preserves pagination info', () => {
    const result = toPaginatedMovies({ results: [rawMovie], page: 2, total_pages: 5 })
    expect(result.page).toBe(2)
    expect(result.totalPages).toBe(5)
    expect(result.results).toEqual([mapMovie(rawMovie)])
  })
})

describe('mapMovieDetails', () => {
  const rawDetails: RawMovieDetails = {
    ...rawMovie,
    backdrop_path: '/backdrop.jpg',
    runtime: 148,
    genres: [{ id: 1, name: 'Фантастика' }],
    credits: {
      cast: [
        { id: 10, name: 'B', character: 'Role B', profile_path: null, order: 1 },
        { id: 11, name: 'A', character: 'Role A', profile_path: '/a.jpg', order: 0 }
      ],
      crew: [
        { id: 20, name: 'Director One', job: 'Director', profile_path: null },
        { id: 21, name: 'Writer One', job: 'Writer', profile_path: null }
      ]
    },
    videos: {
      results: [
        { id: 'v1', key: 'k1', site: 'YouTube', type: 'Trailer', name: 'Trailer' },
        { id: 'v2', key: 'k2', site: 'Vimeo', type: 'Trailer', name: 'Vimeo Trailer' }
      ]
    },
    similar: { results: [rawMovie] }
  }

  it('sorts cast by order and caps it at 16 members', () => {
    const details = mapMovieDetails(rawDetails)
    expect(details.cast.map(member => member.id)).toEqual([11, 10])
  })

  it('keeps only crew members whose job is Director', () => {
    const details = mapMovieDetails(rawDetails)
    expect(details.crew).toEqual([
      { id: 20, name: 'Director One', job: 'Director', profilePath: null }
    ])
  })

  it('keeps only YouTube videos', () => {
    const details = mapMovieDetails(rawDetails)
    expect(details.videos).toEqual([
      { id: 'v1', key: 'k1', site: 'YouTube', type: 'Trailer', name: 'Trailer' }
    ])
  })

  it('maps similar movies and top-level fields', () => {
    const details = mapMovieDetails(rawDetails)
    expect(details.backdropPath).toBe('/backdrop.jpg')
    expect(details.runtime).toBe(148)
    expect(details.genres).toEqual([{ id: 1, name: 'Фантастика' }])
    expect(details.similar).toEqual([mapMovie(rawMovie)])
  })

  it('defaults optional collections to empty arrays', () => {
    const details = mapMovieDetails({ ...rawMovie, backdrop_path: null, runtime: null })
    expect(details.genres).toEqual([])
    expect(details.cast).toEqual([])
    expect(details.crew).toEqual([])
    expect(details.similar).toEqual([])
    expect(details.videos).toEqual([])
  })

  it('caps cast at 16 members even when more are provided', () => {
    const cast = Array.from({ length: 20 }, (_, index) => ({
      id: index,
      name: `Actor ${index}`,
      character: 'Role',
      profile_path: null,
      order: index
    }))
    const details = mapMovieDetails({ ...rawMovie, backdrop_path: null, runtime: null, credits: { cast } })
    expect(details.cast).toHaveLength(16)
    expect(details.cast[0]?.id).toBe(0)
    expect(details.cast[15]?.id).toBe(15)
  })
})

describe('mapActor', () => {
  it('converts snake_case fields to camelCase', () => {
    expect(mapActor({ id: 1, name: 'Актёр', profile_path: '/p.jpg' })).toEqual({
      id: 1,
      name: 'Актёр',
      profilePath: '/p.jpg'
    })
  })
})

describe('toPaginatedActors', () => {
  it('maps results and preserves pagination info', () => {
    const raw = { id: 1, name: 'Актёр', profile_path: null }
    const result = toPaginatedActors({ results: [raw], page: 3, total_pages: 9 })
    expect(result.page).toBe(3)
    expect(result.totalPages).toBe(9)
    expect(result.results).toEqual([mapActor(raw)])
  })
})

describe('mapActorDetails', () => {
  const rawDetails: RawActorDetails = {
    id: 1,
    name: 'Актёр',
    profile_path: null,
    biography: 'Биография',
    birthday: '1980-01-01',
    movie_credits: {
      cast: [
        { ...rawMovie, id: 100, character: 'Role Low', popularity: 1 },
        { ...rawMovie, id: 101, character: 'Role High', popularity: 99 }
      ]
    }
  }

  it('sorts filmography by popularity descending', () => {
    const details = mapActorDetails(rawDetails)
    expect(details.filmography.map(item => item.id)).toEqual([101, 100])
  })

  it('defaults missing character to null and maps fields', () => {
    const details = mapActorDetails({
      ...rawDetails,
      movie_credits: { cast: [{ ...rawMovie, id: 200 }] }
    })
    expect(details.filmography[0]).toEqual({
      id: 200,
      title: rawMovie.title,
      character: null,
      posterPath: rawMovie.poster_path,
      releaseDate: rawMovie.release_date
    })
  })

  it('defaults filmography to an empty array when missing', () => {
    const details = mapActorDetails({ id: 1, name: 'Актёр', profile_path: null, biography: '', birthday: null })
    expect(details.filmography).toEqual([])
  })
})

describe('mapTVShow', () => {
  it('converts snake_case fields to camelCase', () => {
    const raw = { id: 5, name: 'Сериал', overview: 'Описание', poster_path: null, first_air_date: '2020-01-01', vote_average: 7.5 }
    expect(mapTVShow(raw)).toEqual({
      id: 5,
      name: 'Сериал',
      overview: 'Описание',
      posterPath: null,
      firstAirDate: '2020-01-01',
      voteAverage: 7.5
    })
  })
})

describe('toPaginatedTVShows', () => {
  it('maps results and preserves pagination info', () => {
    const raw = { id: 5, name: 'Сериал', overview: '', poster_path: null, first_air_date: null, vote_average: 0 }
    const result = toPaginatedTVShows({ results: [raw], page: 1, total_pages: 1 })
    expect(result.results).toEqual([mapTVShow(raw)])
  })
})

describe('mapTVShowDetails', () => {
  const rawDetails: RawTVShowDetails = {
    id: 5,
    name: 'Сериал',
    overview: '',
    poster_path: null,
    first_air_date: null,
    vote_average: 0,
    backdrop_path: null,
    number_of_seasons: 3,
    number_of_episodes: 24,
    created_by: [{ id: 1, name: 'Создатель', profile_path: null }]
  }

  it('maps created_by entries to crew with job Creator', () => {
    const details = mapTVShowDetails(rawDetails)
    expect(details.crew).toEqual([
      { id: 1, name: 'Создатель', job: 'Creator', profilePath: null }
    ])
  })

  it('maps season and episode counts', () => {
    const details = mapTVShowDetails(rawDetails)
    expect(details.numberOfSeasons).toBe(3)
    expect(details.numberOfEpisodes).toBe(24)
  })

  it('defaults created_by to an empty array when missing', () => {
    const details = mapTVShowDetails({ ...rawDetails, created_by: undefined })
    expect(details.crew).toEqual([])
  })
})
