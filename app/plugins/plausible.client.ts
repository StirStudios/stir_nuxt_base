export default defineNuxtPlugin((nuxtApp) => {
  const config = useAppConfig()
  const plausible = config.analytics?.plausible

  if (
    process.env.NODE_ENV !== 'production' ||
    !plausible?.enabled ||
    !plausible.domain
  )
    return

  const { load } = useScript({
    id: 'plausible-script',
    src: plausible.scriptUrl,
    async: true,
    defer: true,
    'data-domain': plausible.domain,
  })

  load().then(() => {
    window.plausible =
      window.plausible ||
      function (...args) {
        ;(window.plausible.q = window.plausible.q || []).push(args)
      }

    // Send initial pageview
    window.plausible('pageview')

    // Track SPA navigation
    nuxtApp.hook('page:finish', () => {
      window.plausible('pageview')
    })
  })
})
