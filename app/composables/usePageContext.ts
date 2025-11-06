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

  // Element and metadata
  const pageElement = computed(() => page.value?.content?.element || '')

  // ✅ Page props
  const pageProps = computed(() => page.value?.content?.props || {})

  // ✅ Safe title access for hero + meta
  const pageTitle = computed(() => pageProps.value?.title || '')
  const pageCreated = computed(() => pageProps.value?.created || '')
  const pageHide = computed(() => pageProps.value?.hide || false)

  // Body classes (as before)
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

    // ✅ new additions
    pageProps,
    pageTitle,
    pageCreated,
    pageHide,
  }
}
