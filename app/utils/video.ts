import type { Video } from '~/types/movie'

export function pickTrailer(videos: Video[]): Video | undefined {
  return videos.find(video => video.type === 'Trailer') ?? videos[0]
}
