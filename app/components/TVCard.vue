<script setup lang="ts">
import type { TVShow } from '~/types/tv'

const props = defineProps<{
  show: TVShow
}>()
</script>

<template>
  <MediaCard
    :to="`/tv/${props.show.id}`"
    :image="posterUrl(props.show.posterPath)"
    :title="props.show.name"
    :subtitle="formatDate(props.show.firstAirDate, 'TBA') ?? undefined"
    :rating="props.show.voteAverage"
  />
</template>
