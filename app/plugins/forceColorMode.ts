export default defineNuxtPlugin((nuxtApp) => {
  const colorMode = useColorMode()
  const appConfig = useAppConfig()

  // Only apply forced color mode if configured
  if (appConfig.colorMode?.forced) {
    const setColorMode = () => {
      const preference = appConfig.colorMode.preference
      colorMode.preference = preference
      colorMode.value = preference
    }

    // On SSR (server-side), apply the color mode immediately
    nuxtApp.hook('app:rendered', setColorMode)

    // On the client-side (after hydration), ensure the forced color mode is set
    nuxtApp.hook('app:mounted', setColorMode)
  }
})
