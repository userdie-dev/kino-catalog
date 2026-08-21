<script setup lang="ts">
import type { Movie } from '~/types/movie'
import type { PaginatedResult } from '~/types/pagination'

type Mode = 'popular' | 'top_rated' | 'now_playing' | 'upcoming' | 'search'

const modeItems: { label: string, value: Mode }[] = [
  { label: 'Популярные', value: 'popular' },
  { label: 'Топ рейтинга', value: 'top_rated' },
  { label: 'Смотрят сейчас', value: 'now_playing' },
  { label: 'Ожидаемые', value: 'upcoming' },
  { label: 'Поиск', value: 'search' }
]

const fetchers: Record<Exclude<Mode, 'search'>, (page: number) => Promise<PaginatedResult<Movie>>> = {
  popular: fetchPopularMovies,
  top_rated: fetchTopRatedMovies,
  now_playing: fetchNowPlayingMovies,
  upcoming: fetchUpcomingMovies
}

const { mode, searchInput, search, page, isSearching } = useCatalogQuery(modeItems.map(item => item.value), 'popular')

const { data, status, error, refresh } = await useAsyncData(
  'movies-list',
  () => isSearching.value ? searchMovies(search.value.trim(), page.value) : fetchers[mode.value as Exclude<Mode, 'search'>](page.value),
  { watch: [mode, search, page] }
)
</script>

<template>
  <div>
    <UPageHero
      title="Фильмы"
      description="Популярные и высокорейтинговые фильмы TMDB, а также поиск по названию."
    />

    <UPageSection>
      <div
        id="catalog"
        class="flex flex-col gap-4 rounded-xl border border-default bg-elevated/50 p-4 scroll-mt-20 sm:flex-row sm:items-center sm:justify-between mb-6"
      >
        <UTabs
          v-model="mode"
          :items="modeItems"
          class="w-full sm:w-auto"
        />

        <UInput
          v-if="isSearching"
          v-model="searchInput"
          icon="i-lucide-search"
          placeholder="Поиск по названию..."
          class="w-full sm:w-72"
        />
      </div>

      <ErrorAlert
        v-if="error"
        :error="error"
        @retry="refresh()"
      />
      <LoadingSpinner v-else-if="status === 'pending'" />
      <template v-else>
        <UAlert
          v-if="isSearching && !search.trim()"
          color="neutral"
          variant="subtle"
          icon="i-lucide-search"
          title="Введите название фильма"
        />
        <UAlert
          v-else-if="!data?.results.length"
          color="neutral"
          variant="subtle"
          icon="i-lucide-search-x"
          title="Ничего не найдено"
        />
        <div
          v-else
          class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
        >
          <MovieCard
            v-for="movie in data.results"
            :key="movie.id"
            :movie="movie"
          />
        </div>

        <PaginationBar
          v-if="!isSearching || search.trim()"
          v-model:page="page"
          :total-pages="data?.totalPages ?? 1"
        />

        <div
          v-if="(!isSearching || search.trim()) && (data?.totalPages ?? 1) > 1"
          class="flex justify-center pt-4"
        >
          <a
            href="#catalog"
            class="flex items-center gap-1.5 text-sm text-muted hover:text-primary hover:underline"
          >
            <UIcon
              name="i-lucide-arrow-up"
              class="size-4"
            />
            Наверх
          </a>
        </div>
      </template>
    </UPageSection>
  </div>
</template>
