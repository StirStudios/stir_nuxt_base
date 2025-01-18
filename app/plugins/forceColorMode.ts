// This plugin forces the color mode based on app.config.ts, overriding any user preferences before or after mounting the app.

export default defineNuxtPlugin((nuxtApp) => {
  const colorMode = useColorMode()
  const appConfig = useAppConfig()

  if (appConfig.forceColorMode.enabled) {
    nuxtApp.hook('app:mounted', () => {
      colorMode.preference = appConfig.forceColorMode.preference
      colorMode.value = appConfig.forceColorMode.preference
    })
  }
})
