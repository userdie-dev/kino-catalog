export function useDebouncedRef<T>(source: Ref<T>, delay: number) {
  const debounced = ref(source.value) as Ref<T>

  watch(source, (value) => {
    const timer = setTimeout(() => {
      debounced.value = value
    }, delay)
    onWatcherCleanup(() => clearTimeout(timer))
  })

  return debounced
}
