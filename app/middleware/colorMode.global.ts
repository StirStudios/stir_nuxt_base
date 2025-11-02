import { defineNuxtRouteMiddleware, useColorMode, useAppConfig } from '#imports'

export default defineNuxtRouteMiddleware((to) => {
  const colorMode = useColorMode()
  const { forced, preference, lightRoutes = [] } = useAppConfig().colorMode

  if (forced) {
    colorMode.preference = preference
    colorMode.value = preference
    to.meta.colorMode = preference
    return
  }

  const isLight = lightRoutes.some((prefix: string) =>
    to.path.startsWith(prefix),
  )

  const mode = isLight ? 'light' : preference
  colorMode.preference = mode
  colorMode.value = mode
  to.meta.colorMode = mode
})
