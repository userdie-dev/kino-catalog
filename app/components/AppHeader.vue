<script setup>
const navigationLinks = [
  { label: 'Фильмы', to: '/movies' },
  { label: 'Сериалы', to: '/tv' },
  { label: 'Актёры', to: '/actors' },
  { label: 'Сохранённые', to: '/saved' }
]
</script>

<template>
  <UHeader>
    <template #left>
      <NuxtLink
        to="/"
        class="focus-visible:outline-3 outline-primary/25 rounded-md p-1 -ms-1"
      >
        <AppLogo class="w-auto h-6 shrink-0" />
      </NuxtLink>
    </template>

    <UNavigationMenu :items="navigationLinks" />

    <template #right>
      <UColorModeButton />
    </template>
  </UHeader>
</template>
