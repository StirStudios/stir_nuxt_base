export function usePageContext() {
  const { getPage } = useDrupalCe()
  const page = getPage()
  const route = useRoute()

  // Extract slug once for performance
  const slug = route.params.slug?.[0]

  // Determine if this is the front page
  const isFront = computed(
    () =>
      route.path === '/' || route.fullPath.startsWith('/#') || slug === 'front',
  )

  // Ensure we access the reactive value inside `page`
  const isAdministrator = computed(
    () => page.value?.current_user?.roles?.includes('administrator') || false,
  )

  const pageElement = computed(() => page.value?.content?.element || '')

  const bodyClasses = computed(() =>
    [
      slug || 'front',
      isAdministrator.value ? 'logged-in' : '',
      pageElement.value,
    ]
      .filter(Boolean)
      .join(' '),
  )

  return {
    page,
    isFront,
    isAdministrator,
    bodyClasses,
  }
}
