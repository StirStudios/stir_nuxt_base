export function usePageContext(page?: Ref<any> | any) {
  // Normalize page to support both refs and plain objects
  const normalizedPage = isRef(page) ? page.value : page

  // Route-based logic
  const route = useRoute()

  // Determine if this is the front page
  const isFront =
    route.fullPath === '/' || (route.params.slug?.[0] || '') === 'front'

  // Check if the current user is an administrator
  const isAdministrator = !!normalizedPage?.current_user?.is_administrator

  // Determine CSS classes dynamically
  const bodyClasses = `${route.params.slug?.[0] || 'front'} ${isAdministrator ? ' logged-in' : ''}`

  return {
    isFront,
    isAdministrator,
    bodyClasses,
  }
}
