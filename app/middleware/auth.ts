export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server) return

  const config = useAppConfig().protectedRoutes
  if (!config || !config.loginPath || !config.redirectOnLogin) return

  const protectedPaths = config.requireLoginPaths ?? []
  const isProtected = protectedPaths.some((path) => to.path.startsWith(path))
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
