// This plugin forces the color mode to 'dark', overriding any user preferences before or after mounting the app.

export default defineNuxtPlugin((nuxtApp) => {
  const colorMode = useColorMode()
  nuxtApp.hook('app:mounted', () => {
    colorMode.preference = 'dark'
    colorMode.value = 'dark'
  })
})
