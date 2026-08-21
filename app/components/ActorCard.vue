<script setup lang="ts">
import type { Actor } from '~/types/actor'

const props = defineProps<{
  actor: Actor
  subtitle?: string
}>()
</script>

<template>
  <MediaCard
    :to="`/actors/${props.actor.id}`"
    :image="profileUrl(props.actor.profilePath)"
    :title="props.actor.name"
    :subtitle="props.subtitle"
    fallback-icon="i-lucide-user-round"
  />
</template>
