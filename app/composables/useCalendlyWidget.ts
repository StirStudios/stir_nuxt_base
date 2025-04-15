let calendlyScriptLoaded: Promise<CalendlyClient | undefined> | null = null

function loadCalendlyScript(): Promise<CalendlyClient | undefined> {
  if (calendlyScriptLoaded) return calendlyScriptLoaded

  calendlyScriptLoaded = new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(undefined)
    if ('Calendly' in window) return resolve(window.Calendly as CalendlyClient)

    const script = document.createElement('script')
    script.src = 'https://assets.calendly.com/assets/external/widget.js'
    script.onload = () => resolve(window.Calendly as CalendlyClient)
    script.onerror = () => {
      console.error('[Calendly] Failed to load script')
      resolve(undefined)
    }
    document.head.appendChild(script)
  })

  return calendlyScriptLoaded
}

export function useCalendlyWidget(
  container: Ref<HTMLElement | null>,
  url: string,
  onReady?: () => void,
) {
  onMounted(async () => {
    const calendly = await loadCalendlyScript()
    if (calendly && container.value) {
      calendly.initInlineWidget({
        url,
        parentElement: container.value,
      })
      onReady?.()
    }
  })
}
