<script setup lang="ts">
defineProps<{
  error: { statusMessage?: string } | null | undefined
  title?: string
}>()

defineEmits<{
  retry: []
}>()
</script>

<template>
  <UAlert
    color="error"
    variant="subtle"
    icon="i-lucide-alert-triangle"
    :title="title || error?.statusMessage || 'Не удалось загрузить данные'"
    :description="error?.statusMessage?.includes('NUXT_PUBLIC_TMDB_API_KEY') ? 'Добавьте ключ TMDB API в файл .env (см. .env.example).' : undefined"
  >
    <template #actions>
      <UButton
        color="error"
        variant="subtle"
        label="Повторить"
        icon="i-lucide-refresh-cw"
        @click="$emit('retry')"
      />
    </template>
  </UAlert>
</template>
