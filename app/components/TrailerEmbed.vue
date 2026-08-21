<script setup lang="ts">
defineProps<{
  videoKey: string
}>()
</script>

<template>
  <div class="aspect-video w-full max-w-3xl overflow-hidden rounded-xl shadow-lg ring-1 ring-default">
    <iframe
      :src="`https://www.youtube.com/embed/${videoKey}`"
      class="size-full"
      title="Трейлер"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    />
  </div>
</template>
