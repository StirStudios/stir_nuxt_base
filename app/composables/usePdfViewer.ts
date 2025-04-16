export function usePdfViewer() {
  const appConfig = useAppConfig()
  const licenseKey = ref('')
  const PdfViewer = shallowRef()

  onMounted(async () => {
    if (!appConfig.stirTheme?.pdf) return

    try {
      // Dynamically load from root app context by name
      const component = (await import('vue')).getCurrentInstance?.()?.appContext
        .components?.PdfViewer

      if (component) {
        PdfViewer.value = markRaw(component)
      } else {
        console.warn(
          '[PDF Viewer] Component "PdfViewer" not found in app context',
        )
      }

      const { licenseKey: key } = await $fetch<{ licenseKey: string }>(
        '/api/vpv/license-key',
      )
      licenseKey.value = key
    } catch (err) {
      if (import.meta.dev) console.warn('[PDF Viewer] Failed to load:', err)
    }
  })

  return {
    PdfViewer,
    licenseKey,
  }
}
