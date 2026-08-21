<script setup lang="ts">
defineProps<{
  title: string
  backdropUrl?: string
  posterUrl?: string
  score: number
  metaItems: { icon: string, text: string }[]
  genres: { id: number, name: string }[]
  creditLabel?: string
  creditPeople?: { id: number, name: string }[]
  overview: string
}>()
</script>

<template>
  <section class="relative isolate overflow-hidden border-b border-default">
    <div class="absolute inset-0 -z-10">
      <img
        v-if="backdropUrl"
        :src="backdropUrl"
        :alt="title"
        class="size-full object-cover"
      >
      <div
        v-else
        class="size-full bg-elevated"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-default via-default/85 to-default/40" />
      <div class="absolute inset-0 bg-gradient-to-r from-default via-default/50 to-transparent" />
    </div>

    <UContainer class="py-10 sm:py-16">
      <div class="flex flex-col gap-6 sm:flex-row sm:gap-8">
        <img
          v-if="posterUrl"
          :src="posterUrl"
          :alt="title"
          class="mx-auto aspect-2/3 w-44 shrink-0 rounded-xl object-cover shadow-2xl ring-1 ring-white/10 sm:mx-0 sm:w-56"
        >
        <div
          v-else
          class="mx-auto flex aspect-2/3 w-44 shrink-0 items-center justify-center rounded-xl bg-muted shadow-2xl ring-1 ring-white/10 sm:mx-0 sm:w-56"
        >
          <UIcon
            name="i-lucide-image-off"
            class="size-10 text-dimmed"
          />
        </div>

        <div class="min-w-0 space-y-4">
          <div class="flex flex-wrap items-center justify-between gap-4">
            <h1 class="font-heading text-3xl uppercase tracking-wide text-highlighted sm:text-5xl">
              {{ title }}
            </h1>
            <slot name="actions" />
          </div>

          <div class="flex flex-wrap items-center gap-4">
            <ScoreRing :score="score" />

            <div class="flex flex-col gap-1.5 text-sm text-muted">
              <span
                v-for="(item, index) in metaItems"
                :key="index"
                class="flex items-center gap-1.5"
              >
                <UIcon
                  :name="item.icon"
                  class="size-4 shrink-0"
                />
                {{ item.text }}
              </span>
            </div>
          </div>

          <div
            v-if="genres.length"
            class="flex flex-wrap gap-1.5"
          >
            <UBadge
              v-for="genre in genres"
              :key="genre.id"
              color="primary"
              variant="subtle"
              size="sm"
            >
              {{ genre.name }}
            </UBadge>
          </div>

          <div
            v-if="creditPeople?.length"
            class="text-sm"
          >
            <span class="text-muted">{{ creditLabel }}: </span>
            <NuxtLink
              v-for="(person, index) in creditPeople"
              :key="person.id"
              :to="`/actors/${person.id}`"
              class="font-medium hover:text-primary hover:underline"
            >
              {{ person.name }}<span v-if="index < creditPeople.length - 1">, </span>
            </NuxtLink>
          </div>

          <p class="max-w-2xl text-sm leading-relaxed text-toned">
            {{ overview || 'Описание отсутствует.' }}
          </p>
        </div>
      </div>
    </UContainer>
  </section>
</template>
