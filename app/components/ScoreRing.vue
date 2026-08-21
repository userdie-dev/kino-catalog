<script setup lang="ts">
const props = defineProps<{
  score: number
}>()

const percent = computed(() => Math.round(props.score * 10))

const ringColor = computed(() => {
  if (percent.value >= 70) return 'var(--ui-color-primary-400)'
  if (percent.value >= 40) return 'var(--ui-color-warning-400)'
  return 'var(--ui-color-error-400)'
})
</script>

<template>
  <div class="relative size-16 shrink-0 sm:size-20">
    <svg
      viewBox="0 0 36 36"
      class="size-full -rotate-90"
    >
      <circle
        cx="18"
        cy="18"
        r="16"
        fill="none"
        stroke="var(--ui-border)"
        stroke-width="3"
      />
      <circle
        cx="18"
        cy="18"
        r="16"
        fill="none"
        :stroke="ringColor"
        stroke-width="3"
        stroke-linecap="round"
        pathLength="100"
        :stroke-dasharray="`${percent} 100`"
      />
    </svg>
    <div class="absolute inset-0 flex items-center justify-center">
      <span class="text-sm font-bold sm:text-base">{{ percent }}<span class="text-[0.65em] text-muted">%</span></span>
    </div>
  </div>
</template>
