export function posterUrl(posterPath: string | null, size: 'w185' | 'w342' | 'w500' = 'w342') {
  return posterPath ? `https://image.tmdb.org/t/p/${size}${posterPath}` : undefined
}

export function profileUrl(profilePath: string | null, size: 'w185' | 'w342' = 'w185') {
  return profilePath ? `https://image.tmdb.org/t/p/${size}${profilePath}` : undefined
}

export function backdropUrl(backdropPath: string | null, size: 'w780' | 'w1280' = 'w1280') {
  return backdropPath ? `https://image.tmdb.org/t/p/${size}${backdropPath}` : undefined
}
