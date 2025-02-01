export function usePageContext(page) {
  const route = useRoute()
  const routeSlug = route.params.slug?.[0] || 'front'

  // Check if the page is the front page
  const isFront = computed(() => routeSlug === 'front')

  // Check if the current user is an administrator
  const isAdministrator = computed(() => {
    return page?.current_user?.is_administrator || false
  })

  // Determine CSS classes dynamically
  const classes = computed(() => {
    return routeSlug + (isAdministrator.value ? ' logged-in' : '')
  })

  return {
    isFront,
    isAdministrator,
    classes,
  }
}
