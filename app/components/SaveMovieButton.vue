<script setup lang="ts">
import type { Movie } from '~/types/movie'

const props = defineProps<{
  movie: Movie
}>()

const { isSaved, toggleSaved } = useSavedMovies()

const saved = computed(() => isSaved(props.movie.id))
</script>

<template>
  <UButton
    :icon="saved ? 'i-lucide-bookmark-check' : 'i-lucide-bookmark-plus'"
    :color="saved ? 'primary' : 'neutral'"
    :variant="saved ? 'solid' : 'subtle'"
    :label="saved ? 'В списке' : 'Сохранить'"
    @click="toggleSaved(props.movie)"
  />
</template>
