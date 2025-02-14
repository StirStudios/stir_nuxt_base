export function usePageContext() {
  const { getPage } = useDrupalCe()
  const page = getPage()
  const route = useRoute()

  // Extract slug once for performance
  const slug = route.params.slug?.[0]

  // Determine if this is the front page
  const isFront = computed(() => route.fullPath === '/' || slug === 'front')

  // Ensure we access the reactive value inside `page`
  const isAdministrator = computed(
    () => page.value?.current_user?.roles?.includes('administrator') || false,
  )

  // Determine body classes dynamically
  const bodyClasses = computed(
    () => `${slug || 'front'} ${isAdministrator.value ? 'logged-in' : ''}`,
  )

  return {
    page,
    isFront,
    isAdministrator,
    bodyClasses,
  }
}
