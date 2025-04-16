export function usePdfViewer() {
  const appConfig = useAppConfig()
  const licenseKey = ref('')
  const PdfViewer = shallowRef()

  onMounted(async () => {
    if (!appConfig.stirTheme?.pdf) return

    try {
      // Resolve the component by name at runtime
      const resolved = resolveComponent('PdfViewer')
      PdfViewer.value = markRaw(resolved)

      // Fetch the license key
      const { licenseKey: key } = await $fetch<{ licenseKey: string }>(
        '/api/vpv/license-key',
      )
      licenseKey.value = key
    } catch (err) {
      if (import.meta.dev) {
        console.warn(
          '[PDF Viewer] Component not available or license fetch failed:',
          err,
        )
      }
    }
  })

  return {
    PdfViewer,
    licenseKey,
  }
}
