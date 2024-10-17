export async function useDrupalApi() {
  const { fetchPage, renderCustomElements, fetchMenu } = useDrupalCe()
  const route = useRoute()

  const page = await fetchPage(route.path, { query: route.query })

  const isAdministrator = computed(() => {
    return page.value?.current_user?.roles.includes('administrator') || false
  })

  const routeSlug = route.params.slug?.[0] || 'front'
  const isFront = routeSlug === 'front'
  const classes = computed(() => {
    return routeSlug + (isAdministrator.value ? ' logged-in' : '')
  })

  // Flag to indicate data readiness
  const dataReady = ref(false)
  dataReady.value = true

  return {
    isAdministrator,
    renderCustomElements,
    fetchMenu,
    classes,
    isFront,
    page,
    dataReady,
  }
}
