<script setup lang="ts">
const route = useRoute()

const { data: movie, status, error, refresh } = await useAsyncData(
  () => `movie-details-${route.params.id}`,
  () => fetchMovieDetails(route.params.id as string),
  { watch: [() => route.params.id] }
)

const trailer = computed(() => pickTrailer(movie.value?.videos ?? []))

const navLinks = computed(() => [
  ...(trailer.value ? [{ id: 'trailer', label: 'Трейлер' }] : []),
  ...(movie.value?.cast.length ? [{ id: 'cast', label: 'В ролях' }] : []),
  ...(movie.value?.similar.length ? [{ id: 'similar', label: 'Похожие фильмы' }] : [])
])

const metaItems = computed(() => movie.value
  ? [
      { icon: 'i-lucide-calendar', text: formatDate(movie.value.releaseDate, 'TBA') ?? 'TBA' },
      ...(movie.value.runtime ? [{ icon: 'i-lucide-clock', text: `${movie.value.runtime} мин` }] : [])
    ]
  : [])
</script>

<template>
  <div>
    <UPageSection v-if="status === 'pending'">
      <LoadingSpinner />
    </UPageSection>

    <UPageSection v-else-if="error">
      <ErrorAlert
        :error="error"
        @retry="refresh()"
      />
    </UPageSection>

    <template v-else-if="movie">
      <MediaDetailHero
        :title="movie.title"
        :backdrop-url="backdropUrl(movie.backdropPath)"
        :poster-url="posterUrl(movie.posterPath, 'w500')"
        :score="movie.voteAverage"
        :meta-items="metaItems"
        :genres="movie.genres"
        credit-label="Режиссёр"
        :credit-people="movie.crew"
        :overview="movie.overview"
      >
        <template #actions>
          <ClientOnly>
            <SaveMovieButton :movie="movie" />
          </ClientOnly>
        </template>
      </MediaDetailHero>

      <DetailSectionNav :links="navLinks" />

      <UPageSection
        v-if="trailer"
        id="trailer"
        title="Трейлер"
        class="scroll-mt-32"
      >
        <TrailerEmbed :video-key="trailer.key" />
      </UPageSection>

      <UPageSection
        v-if="movie.cast.length"
        id="cast"
        title="В ролях"
        class="scroll-mt-32"
      >
        <CastList :cast="movie.cast" />
      </UPageSection>

      <UPageSection
        v-if="movie.similar.length"
        id="similar"
        title="Похожие фильмы"
        class="scroll-mt-32"
      >
        <div class="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
          <div
            v-for="similar in movie.similar"
            :key="similar.id"
            class="w-40 shrink-0 sm:w-48"
          >
            <MovieCard :movie="similar" />
          </div>
        </div>
      </UPageSection>
    </template>
  </div>
</template>
