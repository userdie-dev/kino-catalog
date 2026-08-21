import { TMDBWebAPI } from 'tmdb-js-web'
import type { Movie, MovieDetails } from '~/types/movie'
import type { Actor, ActorDetails } from '~/types/actor'
import type { TVShow, TVShowDetails } from '~/types/tv'
import type { PaginatedResult } from '~/types/pagination'
import type { RawActor, RawActorDetails, RawMovie, RawMovieDetails, RawTVShow, RawTVShowDetails } from './tmdb-map'

function getClient() {
  const { public: { tmdbApiKey } } = useRuntimeConfig()

  if (!tmdbApiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Missing NUXT_PUBLIC_TMDB_API_KEY environment variable'
    })
  }

  return new TMDBWebAPI({ accessToken: tmdbApiKey })
}

async function callTmdb<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn()
  } catch (error) {
    throw createError({
      statusCode: 502,
      statusMessage: error instanceof Error ? error.message : 'Не удалось загрузить данные из TMDB'
    })
  }
}

type RawPage<TRaw> = { results: TRaw[], page: number, total_pages: number }

function listFetcher<TRaw, T>(
  call: (page: number) => Promise<unknown>,
  toPaginated: (raw: RawPage<TRaw>) => PaginatedResult<T>
) {
  return (page: number) => callTmdb(async () => toPaginated(await call(page) as RawPage<TRaw>))
}

function searchFetcher<TRaw, T>(
  call: (query: string, page: number) => Promise<unknown>,
  toPaginated: (raw: RawPage<TRaw>) => PaginatedResult<T>
) {
  return (query: string, page: number): Promise<PaginatedResult<T>> => {
    if (!query) return Promise.resolve({ results: [], page: 1, totalPages: 1 })
    return callTmdb(async () => toPaginated(await call(query, page) as RawPage<TRaw>))
  }
}

function detailFetcher<TRaw, T>(call: (id: number) => Promise<unknown>, map: (raw: TRaw) => T) {
  return (id: string | number) => callTmdb(async () => map(await call(Number(id)) as TRaw))
}

export const fetchPopularMovies = listFetcher<RawMovie, Movie>(
  page => getClient().v3.movies.getPopular({ language: 'ru', page }),
  toPaginatedMovies
)

export const fetchTopRatedMovies = listFetcher<RawMovie, Movie>(
  page => getClient().v3.movies.getTopRated({ language: 'ru', page }),
  toPaginatedMovies
)

export const fetchNowPlayingMovies = listFetcher<RawMovie, Movie>(
  page => getClient().v3.movies.getNowPlaying({ language: 'ru', page }),
  toPaginatedMovies
)

export const fetchUpcomingMovies = listFetcher<RawMovie, Movie>(
  page => getClient().v3.movies.getUpcoming({ language: 'ru', page }),
  toPaginatedMovies
)

export const searchMovies = searchFetcher<RawMovie, Movie>(
  (query, page) => getClient().v3.search.searchMovies({ query, page, language: 'ru' }),
  toPaginatedMovies
)

export const fetchMovieDetails = detailFetcher<RawMovieDetails, MovieDetails>(
  id => getClient().v3.movies.getDetails(id, { language: 'ru', append_to_response: ['credits', 'videos', 'similar'] }),
  mapMovieDetails
)

export const fetchPopularActors = listFetcher<RawActor, Actor>(
  page => getClient().v3.people.getPopular({ language: 'ru', page }),
  toPaginatedActors
)

// TMDB has no dedicated "top rated" endpoint for people (unlike movies).
// As a practical stand-in for "Лучшие" we take a page of popular people and
// re-rank it by the average vote_average of their known-for titles, so the
// list favours actors known for higher-rated work over raw popularity.
interface RawPersonWithKnownFor extends RawActor {
  known_for?: { vote_average?: number }[]
}

function averageKnownForRating(person: RawPersonWithKnownFor): number {
  const ratings = (person.known_for ?? [])
    .map(item => item.vote_average)
    .filter((value): value is number => typeof value === 'number')

  if (ratings.length === 0) return 0

  return ratings.reduce((sum, value) => sum + value, 0) / ratings.length
}

export function fetchTopRatedActors(page: number): Promise<PaginatedResult<Actor>> {
  return callTmdb(async () => {
    const result = await getClient().v3.people.getPopular({ language: 'ru', page })
    const people = result.results as unknown as RawPersonWithKnownFor[]
    const sorted = people.slice().sort((a, b) => averageKnownForRating(b) - averageKnownForRating(a))

    return {
      results: sorted.map(mapActor),
      page: result.page,
      totalPages: result.total_pages
    }
  })
}

export const searchActors = searchFetcher<RawActor, Actor>(
  (query, page) => getClient().v3.search.searchPeople({ query, page, language: 'ru' }),
  toPaginatedActors
)

export const fetchActorDetails = detailFetcher<RawActorDetails, ActorDetails>(
  id => getClient().v3.people.getDetails(id, { language: 'ru', append_to_response: ['movie_credits'] }),
  mapActorDetails
)

export const fetchPopularTVShows = listFetcher<RawTVShow, TVShow>(
  page => getClient().v3.tv.getPopular({ language: 'ru', page }),
  toPaginatedTVShows
)

export const fetchTopRatedTVShows = listFetcher<RawTVShow, TVShow>(
  page => getClient().v3.tv.getTopRated({ language: 'ru', page }),
  toPaginatedTVShows
)

export const searchTVShows = searchFetcher<RawTVShow, TVShow>(
  (query, page) => getClient().v3.search.searchTV({ query, page, language: 'ru' }),
  toPaginatedTVShows
)

export const fetchTVShowDetails = detailFetcher<RawTVShowDetails, TVShowDetails>(
  id => getClient().v3.tv.getDetails(id, { language: 'ru', append_to_response: ['credits', 'videos', 'similar'] }),
  mapTVShowDetails
)
