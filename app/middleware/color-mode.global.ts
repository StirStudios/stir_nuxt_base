export default defineNuxtRouteMiddleware((to) => {
  const colorMode = useColorMode()
  const lightRoutes = useAppConfig().colorMode.lightRoutes || []

  const isLight = lightRoutes.some((prefix: string) =>
    to.path.startsWith(prefix),
  )

  to.meta.colorMode = isLight ? 'light' : 'dark'
  colorMode.preference = isLight ? 'light' : 'dark'
  colorMode.value = isLight ? 'light' : 'dark'
})
