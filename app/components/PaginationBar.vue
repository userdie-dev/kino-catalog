<script setup lang="ts">
const page = defineModel<number>('page', { required: true })

defineProps<{
  totalPages: number
}>()
</script>

<template>
  <div
    v-if="totalPages > 1"
    class="flex justify-center pt-4"
  >
    <UPagination
      v-model:page="page"
      :total="totalPages"
      :items-per-page="1"
      :sibling-count="1"
    />
  </div>
</template>
