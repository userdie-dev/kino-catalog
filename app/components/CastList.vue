<script setup lang="ts">
import type { CastMember } from '~/types/movie'

defineProps<{
  cast: CastMember[]
}>()
</script>

<template>
  <div class="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
    <div
      v-for="member in cast"
      :key="member.id"
      class="w-32 shrink-0 sm:w-40"
    >
      <ActorCard
        :actor="member"
        :subtitle="member.character"
      />
    </div>
  </div>
</template>
