<script setup lang="ts">
defineProps<{
  links: { id: string, label: string }[]
}>()
</script>

<template>
  <nav
    v-if="links.length"
    class="sticky top-(--ui-header-height) z-40 border-b border-default bg-default/80 backdrop-blur"
  >
    <UContainer class="flex gap-6 overflow-x-auto py-3 text-sm scrollbar-none">
      <a
        v-for="link in links"
        :key="link.id"
        :href="`#${link.id}`"
        class="shrink-0 font-medium text-muted hover:text-primary"
      >{{ link.label }}</a>
    </UContainer>
  </nav>
</template>
