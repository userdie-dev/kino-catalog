import type { Movie } from '~/types/movie'

const STORAGE_KEY = 'saved-movies'

const savedMovies = ref<Movie[]>([])
let loaded = false

function load() {
  if (loaded || !import.meta.client) return
  loaded = true

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    savedMovies.value = raw ? JSON.parse(raw) : []
  } catch {
    savedMovies.value = []
  }
}

function persist() {
  if (!import.meta.client) return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(savedMovies.value))
}

export function useSavedMovies() {
  load()

  const isSaved = (id: number) => savedMovies.value.some(movie => movie.id === id)

  function toggleSaved(movie: Movie) {
    const index = savedMovies.value.findIndex(saved => saved.id === movie.id)

    if (index === -1) {
      savedMovies.value.push({
        id: movie.id,
        title: movie.title,
        overview: movie.overview,
        posterPath: movie.posterPath,
        releaseDate: movie.releaseDate,
        voteAverage: movie.voteAverage
      })
    } else {
      savedMovies.value.splice(index, 1)
    }

    persist()
  }

  function removeSaved(id: number) {
    const index = savedMovies.value.findIndex(saved => saved.id === id)
    if (index === -1) return

    savedMovies.value.splice(index, 1)
    persist()
  }

  return { savedMovies, isSaved, toggleSaved, removeSaved }
}
