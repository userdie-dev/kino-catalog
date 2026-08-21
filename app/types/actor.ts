export interface Actor {
  id: number
  name: string
  profilePath: string | null
}

export interface FilmographyItem {
  id: number
  title: string
  character: string | null
  posterPath: string | null
  releaseDate: string | null
}

export interface ActorDetails extends Actor {
  biography: string
  birthday: string | null
  filmography: FilmographyItem[]
}
