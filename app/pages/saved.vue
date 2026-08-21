<script setup lang="ts">
const { savedMovies, removeSaved } = useSavedMovies()
</script>

<template>
  <div>
    <UPageHero
      title="Сохранённые"
      description="Фильмы, добавленные в ваш личный список."
    />

    <UPageSection>
      <ClientOnly>
        <UAlert
          v-if="!savedMovies.length"
          color="neutral"
          variant="subtle"
          icon="i-lucide-bookmark"
          title="Список пуст"
          description="Добавляйте фильмы в список на странице фильма."
        />
        <div
          v-else
          class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
        >
          <div
            v-for="movie in savedMovies"
            :key="movie.id"
            class="relative"
          >
            <MovieCard :movie="movie" />
            <UButton
              icon="i-lucide-x"
              color="neutral"
              variant="solid"
              size="xs"
              class="absolute right-2 top-2 z-10 bg-black/60 backdrop-blur-sm ring-0"
              aria-label="Удалить из списка"
              @click.prevent.stop="removeSaved(movie.id)"
            />
          </div>
        </div>

        <template #fallback>
          <LoadingSpinner />
        </template>
      </ClientOnly>
    </UPageSection>
  </div>
</template>
