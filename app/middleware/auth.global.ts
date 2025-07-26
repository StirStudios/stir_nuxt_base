export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server) return

  const config = useAppConfig().protectedRoutes
  if (!config) return

  // Safely try to use useUserSession
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
  } catch {
    // Fallback: assume unauthenticated, but do not crash
  }

  if (!ready.value) await fetch()

  if (to.path === config.loginPath && loggedIn.value) {
    return navigateTo(config.redirectOnLogin)
  }

  if (config.requireLoginPaths?.includes(to.path) && !loggedIn.value) {
    const password = to.query.password
    return navigateTo({
      path: config.loginPath,
      query: password ? { password } : {},
    })
  }
})
