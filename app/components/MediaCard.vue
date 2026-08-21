<script setup lang="ts">
withDefaults(defineProps<{
  to: string
  image?: string
  title: string
  subtitle?: string
  detail?: string
  rating?: number
  fallbackIcon?: string
}>(), {
  fallbackIcon: 'i-lucide-image-off'
})
</script>

<template>
  <NuxtLink
    :to="to"
    class="group relative block aspect-2/3 w-full overflow-hidden rounded-xl bg-muted ring-1 ring-default focus-visible:outline-2 focus-visible:outline-primary transition-shadow hover:shadow-lg hover:shadow-black/20"
  >
    <img
      v-if="image"
      :src="image"
      :alt="title"
      class="size-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
      loading="lazy"
    >
    <div
      v-else
      class="flex size-full items-center justify-center bg-muted"
    >
      <UIcon
        :name="fallbackIcon"
        class="size-8 text-dimmed"
      />
    </div>

    <div
      v-if="rating !== undefined"
      class="absolute inset-x-0 top-0 flex justify-end p-2"
    >
      <UBadge
        color="neutral"
        variant="solid"
        icon="i-lucide-star"
        size="sm"
        class="bg-black/60 text-amber-400 backdrop-blur-sm ring-0"
      >
        {{ rating.toFixed(1) }}
      </UBadge>
    </div>

    <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent p-3 pt-8">
      <h3 class="text-shadow-sm truncate text-sm font-semibold text-white">
        {{ title }}
      </h3>
      <p
        v-if="subtitle"
        class="text-shadow-sm truncate text-xs text-white/70"
      >
        {{ subtitle }}
      </p>
      <p
        v-if="detail"
        class="text-shadow-sm truncate text-xs text-white/50"
      >
        {{ detail }}
      </p>
    </div>
  </NuxtLink>
</template>
