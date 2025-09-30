export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server) return
  const config = useAppConfig().protectedRoutes
  if (!config) return

  const protectedPaths = config.requireLoginPaths || []
  if (!protectedPaths.length) return

  const isProtected = protectedPaths.some((path) => {
    return path.endsWith('/') ? to.path.startsWith(path) : to.path === path
  })

  if (!isProtected) return

  const session = useUserSession()
  if (!session.ready.value) {
    await session.fetch()
  }

  if (to.path === config.loginPath && session.loggedIn.value) {
    return navigateTo(config.redirectOnLogin)
  }

  if (!session.loggedIn.value) {
    return navigateTo({
      path: config.loginPath,
      query: to.query,
    })
  }
})
