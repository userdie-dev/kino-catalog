import type { CastMember, CrewMember, Genre, Video } from './movie'

export interface TVShow {
  id: number
  name: string
  overview: string
  posterPath: string | null
  firstAirDate: string | null
  voteAverage: number
}

export interface TVShowDetails extends TVShow {
  backdropPath: string | null
  numberOfSeasons: number
  numberOfEpisodes: number
  genres: Genre[]
  cast: CastMember[]
  crew: CrewMember[]
  similar: TVShow[]
  videos: Video[]
}
