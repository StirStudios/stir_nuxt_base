import { defineNuxtPlugin, useAppConfig, useScript } from '#imports'

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
    type PlausibleQueueFunction = ((
      event: string,
      options?: Record<string, unknown>,
    ) => void) & {
      q?: unknown[]
    }

    const win = window as unknown as {
      plausible?: PlausibleQueueFunction
    }

    const plausibleFn: PlausibleQueueFunction =
      win.plausible ??
      function (event, options) {
        ;(plausibleFn.q ??= []).push([event, options])
      }

    win.plausible = plausibleFn

    // Initial pageview
    plausibleFn('pageview')

    // SPA route tracking
    nuxtApp.hook('page:finish', () => {
      plausibleFn('pageview')
    })
  })
})
