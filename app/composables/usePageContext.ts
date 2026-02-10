export function usePageContext() {
  const { getPage } = useDrupalCe()
  const page = getPage()
  const route = useRoute()

  // Reactive + safe slug
  const slug = computed(() => {
    const p = route.params.slug
    return Array.isArray(p) ? p[0] : p || null
  })

  const isFront = computed(() => route.path === '/')
  const isAdministrator = computed(
    () => page.value?.current_user?.roles?.includes('administrator') || false,
  )

  // Element and metadata
  const pageElement = computed(() => page.value?.content?.element || '')

  // Page props
  const pageProps = computed(() => page.value?.content?.props || {})

  // Safe title access for hero + meta
  const pageTitle = computed(() => pageProps.value?.title || '')
  const pageCreated = computed(() => pageProps.value?.created || '')
  const pageHide = computed(() => pageProps.value?.hide || false)
  const pageLayout = computed(() => page.value?.page_layout || '')
  const bodyClasses = computed(() =>
    [
      slug.value || 'front',
      isAdministrator.value ? 'logged-in' : '',
      pageElement.value,
    ]
      .filter(Boolean)
      .join(' '),
  )

  return {
    page,
    slug,
    isFront,
    isAdministrator,
    bodyClasses,
    pageTitle,
    pageCreated,
    pageHide,
    pageLayout,
  }
}
