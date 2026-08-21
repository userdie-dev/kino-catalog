<script setup lang="ts">
const route = useRoute()

const { data: actor, status, error, refresh } = await useAsyncData(
  () => `actor-details-${route.params.id}`,
  () => fetchActorDetails(route.params.id as string),
  { watch: [() => route.params.id] }
)
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

    <template v-else-if="actor">
      <section class="relative isolate overflow-hidden border-b border-default bg-elevated">
        <UContainer class="py-10 sm:py-16">
          <div class="flex flex-col gap-6 sm:flex-row sm:gap-8">
            <img
              v-if="profileUrl(actor.profilePath, 'w342')"
              :src="profileUrl(actor.profilePath, 'w342')"
              :alt="actor.name"
              class="mx-auto aspect-2/3 w-44 shrink-0 rounded-xl object-cover shadow-2xl ring-1 ring-default sm:mx-0 sm:w-56"
            >
            <div
              v-else
              class="mx-auto flex aspect-2/3 w-44 shrink-0 items-center justify-center rounded-xl bg-muted shadow-2xl ring-1 ring-default sm:mx-0 sm:w-56"
            >
              <UIcon
                name="i-lucide-user-round"
                class="size-10 text-dimmed"
              />
            </div>

            <div class="min-w-0 space-y-4">
              <h1 class="font-heading text-3xl uppercase tracking-wide text-highlighted sm:text-5xl">
                {{ actor.name }}
              </h1>

              <p
                v-if="formatDate(actor.birthday)"
                class="flex items-center gap-1.5 text-sm text-muted"
              >
                <UIcon
                  name="i-lucide-cake"
                  class="size-4 shrink-0"
                />
                {{ formatDate(actor.birthday) }}
              </p>

              <p class="max-w-2xl whitespace-pre-line text-sm leading-relaxed text-toned">
                {{ actor.biography || 'Биография отсутствует.' }}
              </p>
            </div>
          </div>
        </UContainer>
      </section>

      <UPageSection
        v-if="actor.filmography.length"
        title="Фильмография"
      >
        <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          <MediaCard
            v-for="film in actor.filmography"
            :key="`${film.id}-${film.character}`"
            :to="`/movies/${film.id}`"
            :image="posterUrl(film.posterPath)"
            :title="film.title"
            :subtitle="formatDate(film.releaseDate, 'TBA') ?? undefined"
            :detail="film.character ?? undefined"
          />
        </div>
      </UPageSection>
    </template>
  </div>
</template>
