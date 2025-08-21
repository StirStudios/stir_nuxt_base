export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server) return

  const config = useAppConfig().protectedRoutes
  if (!config || !config.loginPath || !config.redirectOnLogin) return

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

  if (config.requireLoginPaths?.includes(to.path) && !loggedIn.value) {
    return navigateTo(config.loginPath)
  }
})
