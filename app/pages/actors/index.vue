<script setup lang="ts">
import type { Actor } from '~/types/actor'
import type { PaginatedResult } from '~/types/pagination'

type Mode = 'popular' | 'top_rated' | 'search'

const modeItems: { label: string, value: Mode }[] = [
  { label: 'Популярные', value: 'popular' },
  { label: 'Лучшие', value: 'top_rated' },
  { label: 'Поиск', value: 'search' }
]

const fetchers: Record<Exclude<Mode, 'search'>, (page: number) => Promise<PaginatedResult<Actor>>> = {
  popular: fetchPopularActors,
  top_rated: fetchTopRatedActors
}

const { mode, searchInput, search, page, isSearching } = useCatalogQuery(modeItems.map(item => item.value), 'popular')

const { data, status, error, refresh } = await useAsyncData(
  'actors-list',
  () => isSearching.value ? searchActors(search.value.trim(), page.value) : fetchers[mode.value as Exclude<Mode, 'search'>](page.value),
  { watch: [mode, search, page] }
)
</script>

<template>
  <div>
    <UPageHero
      title="Актёры"
      description="Популярные актёры TMDB, а также поиск по имени."
    />

    <UPageSection>
      <div class="flex flex-col gap-4 rounded-xl border border-default bg-elevated/50 p-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <UTabs
          v-model="mode"
          :items="modeItems"
          class="w-full sm:w-auto"
        />

        <UInput
          v-if="isSearching"
          v-model="searchInput"
          icon="i-lucide-search"
          placeholder="Поиск по имени..."
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
          title="Введите имя актёра"
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
          <ActorCard
            v-for="actor in data.results"
            :key="actor.id"
            :actor="actor"
          />
        </div>

        <PaginationBar
          v-if="!isSearching || search.trim()"
          v-model:page="page"
          :total-pages="data?.totalPages ?? 1"
        />
      </template>
    </UPageSection>
  </div>
</template>
