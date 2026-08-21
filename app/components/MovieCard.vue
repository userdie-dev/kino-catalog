<script setup lang="ts">
import type { Movie } from '~/types/movie'

const props = defineProps<{
  movie: Movie
}>()
</script>

<template>
  <MediaCard
    :to="`/movies/${props.movie.id}`"
    :image="posterUrl(props.movie.posterPath)"
    :title="props.movie.title"
    :subtitle="formatDate(props.movie.releaseDate, 'TBA') ?? undefined"
    :rating="props.movie.voteAverage"
  />
</template>
