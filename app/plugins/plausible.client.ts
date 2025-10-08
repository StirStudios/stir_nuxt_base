import { useScript } from '#imports'

export default defineNuxtPlugin((nuxtApp) => {
  if (!import.meta.client) return

  const cfg = useAppConfig().analytics?.plausible

  if (process.env.NODE_ENV !== 'production' || !cfg?.enabled || !cfg.domain)
    return

  const { onLoaded } = useScript({
    id: 'plausible-script',
    src: cfg.scriptUrl,
    async: true,
    defer: true,
    'data-domain': cfg.domain,
  })

  onLoaded(() => {
    // Initialize plausible queue if needed
    window.plausible =
      window.plausible ||
      function (...args) {
        ;(window.plausible.q = window.plausible.q || []).push(args)
      }

    // Initial pageview
    window.plausible('pageview')

    // SPA route change tracking
    nuxtApp.hook('page:finish', () => {
      window.plausible('pageview')
    })
  })
})
