import type { CalendlyClient } from '~/types/UtilityTypes'

declare global {
  interface Window {
    Calendly: CalendlyClient
  }
}

let calendlyScriptLoaded: Promise<CalendlyClient | undefined> | null = null

function loadCalendlyScript(): Promise<CalendlyClient | undefined> {
  if (calendlyScriptLoaded) return calendlyScriptLoaded

  calendlyScriptLoaded = new Promise((resolve) => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return resolve(undefined)
    }

    if ('Calendly' in window) {
      return resolve(window.Calendly)
    }

    const script = document.createElement('script')
    script.src = 'https://assets.calendly.com/assets/external/widget.js'
    script.async = true
    script.defer = true
    script.onload = () => resolve(window.Calendly)
    script.onerror = () => {
      if (import.meta.dev) {
        console.error('[Calendly] Failed to load script')
      }
      resolve(undefined)
    }

    document.head.appendChild(script)
  })

  return calendlyScriptLoaded
}

function isCalendlyEvent(e: MessageEvent): boolean {
  return (
    typeof e.data?.event === 'string' && e.data.event.startsWith('calendly')
  )
}

export function useCalendlyWidget(
  container: Ref<HTMLElement | null>,
  url: string,
  onReady?: () => void,
) {
  let handler: ((e: MessageEvent) => void) | null = null

  onMounted(async () => {
    const calendly = await loadCalendlyScript()
    if (!calendly || !container.value) return

    calendly.initInlineWidget({
      url,
      parentElement: container.value,
    })

    onReady?.()

    handler = (e: MessageEvent) => {
      if (
        isCalendlyEvent(e) &&
        e.data.event === 'calendly.page_height' &&
        container.value
      ) {
        const height = parseInt(e.data.payload?.height || '', 10)
        if (!isNaN(height)) {
          container.value.style.height = `${height}px`
        }
      }
    }

    window.addEventListener('message', handler)
  })

  onBeforeUnmount(() => {
    if (handler) {
      window.removeEventListener('message', handler)
    }
  })
}
