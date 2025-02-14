export function usePageContext(page?: Ref<any> | any) {
  const normalizedPage = isRef(page) ? page.value : page
  const route = useRoute()

  // Extract slug once for performance
  const slug = route.params.slug?.[0]

  // Determine if this is the front page
  const isFront = computed(() => route.fullPath === '/' || slug === 'front')

  // Check if the current user is an administrator
  const isAdministrator = computed(
    () =>
      normalizedPage?.current_user?.roles?.includes('administrator') || false,
  )

  // Determine CSS classes dynamically
  const bodyClasses = computed(
    () => `${slug || 'front'} ${isAdministrator.value ? 'logged-in' : ''}`,
  )

  return {
    isFront,
    isAdministrator,
    bodyClasses,
  }
}
