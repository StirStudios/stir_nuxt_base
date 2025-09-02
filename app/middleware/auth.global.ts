export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server) return

  const config = useAppConfig().protectedRoutes
  if (!config) return

  const protectedPaths = config.requireLoginPaths || []
  if (!protectedPaths.length) return

  const isProtected = protectedPaths.some((path) => {
    // Exact match
    if (path.endsWith('/')) {
      // Match any child route, e.g., /admin/ matches /admin/settings
      return to.path.startsWith(path)
    } else {
      // Match only exact route, e.g., /admin only matches /admin
      return to.path === path
    }
  })

  if (!isProtected) return

  let ready = ref(true)
  let loggedIn = ref(false)
  let fetch = async () => {}

  try {
    const session = useUserSession?.()
    if (session) {
      ready = session.ready
      loggedIn = session.loggedIn
      fetch = session.fetch
    }
  } catch {}

  if (!ready.value) await fetch()

  if (to.path === config.loginPath && loggedIn.value) {
    return navigateTo(config.redirectOnLogin)
  }

  if (!loggedIn.value) {
    return navigateTo(config.loginPath)
  }
})
