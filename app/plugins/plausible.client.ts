import { defineNuxtPlugin, useAppConfig, useScript } from '#imports'

export default defineNuxtPlugin((nuxtApp) => {
  if (!import.meta.client) return

  const cfg = useAppConfig().analytics?.plausible
  if (
    process.env.NODE_ENV !== 'production' ||
    !cfg?.enabled ||
    !cfg.domain ||
    !cfg.scriptUrl
  )
    return
  const scriptUrl = cfg.scriptUrl
  const domain = cfg.domain

  const loadPlausible = () =>
    useScript({
      id: 'plausible-script',
      src: scriptUrl,
      async: true,
      defer: true,
      'data-domain': domain,
    })

  const onScriptLoaded = ({ onLoaded }: ReturnType<typeof loadPlausible>) =>
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
    plausibleFn('pageview')
    nuxtApp.hook('page:finish', () => {
      plausibleFn('pageview')
    })
  })

  const idleApi = globalThis as typeof globalThis & {
    requestIdleCallback?: (callback: IdleRequestCallback) => number
  }

  if (typeof idleApi.requestIdleCallback === 'function') {
    idleApi.requestIdleCallback(() => onScriptLoaded(loadPlausible()))
  } else {
    setTimeout(() => onScriptLoaded(loadPlausible()), 1)
  }
})
