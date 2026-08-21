export interface Movie {
  id: number
  title: string
  overview: string
  posterPath: string | null
  releaseDate: string | null
  voteAverage: number
}

export interface Genre {
  id: number
  name: string
}

export interface CastMember {
  id: number
  name: string
  character: string
  profilePath: string | null
}

export interface CrewMember {
  id: number
  name: string
  job: string
  profilePath: string | null
}

export interface Video {
  id: string
  key: string
  site: string
  type: string
  name: string
}

export interface MovieDetails extends Movie {
  backdropPath: string | null
  runtime: number | null
  genres: Genre[]
  cast: CastMember[]
  crew: CrewMember[]
  similar: Movie[]
  videos: Video[]
}
