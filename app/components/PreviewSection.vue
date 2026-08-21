<script setup lang="ts">
defineProps<{
  title: string
  to: string
  status: 'idle' | 'pending' | 'success' | 'error'
  error?: { statusMessage?: string } | null
}>()

defineEmits<{
  retry: []
}>()
</script>

<template>
  <UPageSection :title="title">
    <template #links>
      <UButton
        :to="to"
        variant="link"
        color="neutral"
        trailing-icon="i-lucide-arrow-right"
        label="Показать все"
      />
    </template>

    <ErrorAlert
      v-if="error"
      :error="error"
      @retry="$emit('retry')"
    />
    <LoadingSpinner v-else-if="status === 'pending'" />
    <div
      v-else
      class="flex gap-4 overflow-x-auto pb-2 scrollbar-none"
    >
      <slot />
    </div>
  </UPageSection>
</template>
