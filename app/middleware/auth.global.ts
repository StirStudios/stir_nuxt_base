export default defineNuxtRouteMiddleware(async (to) => {
  const config = useAppConfig().protectedRoutes
  if (!config) return

  const protectedPaths = config.requireLoginPaths || []
  if (!protectedPaths.length) return

  const isProtected = protectedPaths.some((path) => {
    if (path.endsWith('/')) {
      return to.path.startsWith(path)
    } else {
      return to.path === path
    }
  })

  if (!isProtected) return

  const session = useUserSession?.()
  if (!session) return

  if (!session.ready.value) {
    await session.fetch()
  }

  // Redirect logged-in user away from login page
  if (to.path === config.loginPath && session.loggedIn.value) {
    return navigateTo(config.redirectOnLogin)
  }

  // Not logged in → redirect to login, preserving query (e.g. ?password=...)
  if (!session.loggedIn.value) {
    return navigateTo({
      path: config.loginPath,
      query: to.query,
    })
  }
})
