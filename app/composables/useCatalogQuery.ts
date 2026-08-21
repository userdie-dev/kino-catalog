export function useCatalogQuery<TMode extends string>(modes: TMode[], defaultMode: TMode) {
  const route = useRoute()
  const router = useRouter()

  const mode = ref<TMode>(modes.includes(route.query.mode as TMode) ? (route.query.mode as TMode) : defaultMode)
  const searchInput = ref(typeof route.query.q === 'string' ? route.query.q : '')
  const search = useDebouncedRef(searchInput, 400)
  const page = ref(route.query.page ? Number(route.query.page) || 1 : 1)

  const isSearching = computed(() => mode.value === 'search')

  watch([mode, search], () => {
    page.value = 1
  })

  watch([mode, search, page], () => {
    router.replace({
      query: {
        ...(mode.value !== defaultMode ? { mode: mode.value } : {}),
        ...(isSearching.value && search.value.trim() ? { q: search.value.trim() } : {}),
        ...(page.value > 1 ? { page: page.value } : {})
      }
    })
  })

  return { mode, searchInput, search, page, isSearching }
}
