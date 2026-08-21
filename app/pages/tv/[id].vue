<script setup lang="ts">
const route = useRoute()

const { data: show, status, error, refresh } = await useAsyncData(
  () => `tv-details-${route.params.id}`,
  () => fetchTVShowDetails(route.params.id as string),
  { watch: [() => route.params.id] }
)

const trailer = computed(() => pickTrailer(show.value?.videos ?? []))

const navLinks = computed(() => [
  ...(trailer.value ? [{ id: 'trailer', label: 'Трейлер' }] : []),
  ...(show.value?.cast.length ? [{ id: 'cast', label: 'В ролях' }] : []),
  ...(show.value?.similar.length ? [{ id: 'similar', label: 'Похожие сериалы' }] : [])
])

const metaItems = computed(() => show.value
  ? [
      { icon: 'i-lucide-calendar', text: formatDate(show.value.firstAirDate, 'TBA') ?? 'TBA' },
      ...(show.value.numberOfSeasons
        ? [{ icon: 'i-lucide-clapperboard', text: `${show.value.numberOfSeasons} ${show.value.numberOfSeasons === 1 ? 'сезон' : 'сезонов'}, ${show.value.numberOfEpisodes} эп.` }]
        : [])
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

    <template v-else-if="show">
      <MediaDetailHero
        :title="show.name"
        :backdrop-url="backdropUrl(show.backdropPath)"
        :poster-url="posterUrl(show.posterPath, 'w500')"
        :score="show.voteAverage"
        :meta-items="metaItems"
        :genres="show.genres"
        credit-label="Создатель"
        :credit-people="show.crew"
        :overview="show.overview"
      />

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
        v-if="show.cast.length"
        id="cast"
        title="В ролях"
        class="scroll-mt-32"
      >
        <CastList :cast="show.cast" />
      </UPageSection>

      <UPageSection
        v-if="show.similar.length"
        id="similar"
        title="Похожие сериалы"
        class="scroll-mt-32"
      >
        <div class="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
          <div
            v-for="similar in show.similar"
            :key="similar.id"
            class="w-40 shrink-0 sm:w-48"
          >
            <TVCard :show="similar" />
          </div>
        </div>
      </UPageSection>
    </template>
  </div>
</template>
