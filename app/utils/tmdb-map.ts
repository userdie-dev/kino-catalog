import type { Movie, MovieDetails, CastMember, Video } from '~/types/movie'
import type { Actor, ActorDetails } from '~/types/actor'
import type { TVShow, TVShowDetails } from '~/types/tv'
import type { PaginatedResult } from '~/types/pagination'

export interface RawMovie {
  id: number
  title: string
  overview: string
  poster_path: string | null
  release_date: string | null
  vote_average: number
}

export function mapMovie(raw: RawMovie): Movie {
  return {
    id: raw.id,
    title: raw.title,
    overview: raw.overview,
    posterPath: raw.poster_path,
    releaseDate: raw.release_date,
    voteAverage: raw.vote_average
  }
}

export function toPaginatedMovies(page: { results: RawMovie[], page: number, total_pages: number }): PaginatedResult<Movie> {
  return {
    results: page.results.map(mapMovie),
    page: page.page,
    totalPages: page.total_pages
  }
}

interface RawGenre {
  id: number
  name: string
}

interface RawCastMember {
  id: number
  name: string
  character: string
  profile_path: string | null
  order: number
}

interface RawCrewMember {
  id: number
  name: string
  job: string
  profile_path: string | null
}

interface RawVideo {
  id: string
  key: string
  site: string
  type: string
  name: string
}

function mapCast(cast: RawCastMember[] = []): CastMember[] {
  return cast
    .slice()
    .sort((a, b) => a.order - b.order)
    .slice(0, 16)
    .map(member => ({
      id: member.id,
      name: member.name,
      character: member.character,
      profilePath: member.profile_path
    }))
}

function mapVideos(videos: RawVideo[] = []): Video[] {
  return videos
    .filter(video => video.site === 'YouTube')
    .map(video => ({
      id: video.id,
      key: video.key,
      site: video.site,
      type: video.type,
      name: video.name
    }))
}

export interface RawMovieDetails extends RawMovie {
  backdrop_path: string | null
  runtime: number | null
  genres?: RawGenre[]
  credits?: { cast?: RawCastMember[], crew?: RawCrewMember[] }
  videos?: { results?: RawVideo[] }
  similar?: { results?: RawMovie[] }
}

export function mapMovieDetails(raw: RawMovieDetails): MovieDetails {
  const directors = (raw.credits?.crew ?? [])
    .filter(member => member.job === 'Director')
    .map(member => ({
      id: member.id,
      name: member.name,
      job: member.job,
      profilePath: member.profile_path
    }))

  return {
    ...mapMovie(raw),
    backdropPath: raw.backdrop_path,
    runtime: raw.runtime,
    genres: (raw.genres ?? []).map(genre => ({ id: genre.id, name: genre.name })),
    cast: mapCast(raw.credits?.cast),
    crew: directors,
    similar: (raw.similar?.results ?? []).map(mapMovie),
    videos: mapVideos(raw.videos?.results)
  }
}

export interface RawActor {
  id: number
  name: string
  profile_path: string | null
}

export function mapActor(raw: RawActor): Actor {
  return {
    id: raw.id,
    name: raw.name,
    profilePath: raw.profile_path
  }
}

export function toPaginatedActors(page: { results: RawActor[], page: number, total_pages: number }): PaginatedResult<Actor> {
  return {
    results: page.results.map(mapActor),
    page: page.page,
    totalPages: page.total_pages
  }
}

interface RawFilmographyEntry extends RawMovie {
  character?: string
  popularity?: number
}

export interface RawActorDetails extends RawActor {
  biography: string
  birthday: string | null
  movie_credits?: { cast?: RawFilmographyEntry[] }
}

export function mapActorDetails(raw: RawActorDetails): ActorDetails {
  const filmography = (raw.movie_credits?.cast ?? [])
    .slice()
    .sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0))
    .map(item => ({
      id: item.id,
      title: item.title,
      character: item.character ?? null,
      posterPath: item.poster_path,
      releaseDate: item.release_date
    }))

  return {
    ...mapActor(raw),
    biography: raw.biography,
    birthday: raw.birthday,
    filmography
  }
}

export interface RawTVShow {
  id: number
  name: string
  overview: string
  poster_path: string | null
  first_air_date: string | null
  vote_average: number
}

export function mapTVShow(raw: RawTVShow): TVShow {
  return {
    id: raw.id,
    name: raw.name,
    overview: raw.overview,
    posterPath: raw.poster_path,
    firstAirDate: raw.first_air_date,
    voteAverage: raw.vote_average
  }
}

export function toPaginatedTVShows(page: { results: RawTVShow[], page: number, total_pages: number }): PaginatedResult<TVShow> {
  return {
    results: page.results.map(mapTVShow),
    page: page.page,
    totalPages: page.total_pages
  }
}

interface RawCreator {
  id: number
  name: string
  profile_path: string | null
}

export interface RawTVShowDetails extends RawTVShow {
  backdrop_path: string | null
  number_of_seasons: number
  number_of_episodes: number
  genres?: RawGenre[]
  created_by?: RawCreator[]
  credits?: { cast?: RawCastMember[] }
  videos?: { results?: RawVideo[] }
  similar?: { results?: RawTVShow[] }
}

export function mapTVShowDetails(raw: RawTVShowDetails): TVShowDetails {
  const crew = (raw.created_by ?? []).map(creator => ({
    id: creator.id,
    name: creator.name,
    job: 'Creator',
    profilePath: creator.profile_path
  }))

  return {
    ...mapTVShow(raw),
    backdropPath: raw.backdrop_path,
    numberOfSeasons: raw.number_of_seasons,
    numberOfEpisodes: raw.number_of_episodes,
    genres: (raw.genres ?? []).map(genre => ({ id: genre.id, name: genre.name })),
    cast: mapCast(raw.credits?.cast),
    crew,
    similar: (raw.similar?.results ?? []).map(mapTVShow),
    videos: mapVideos(raw.videos?.results)
  }
}
