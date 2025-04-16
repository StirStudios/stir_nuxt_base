export function usePdfViewer() {
  const appConfig = useAppConfig()
  const licenseKey = ref('')

  const PdfViewer = computed(() => {
    if (!appConfig.stirTheme?.pdf) return null
    try {
      return markRaw(resolveComponent('PdfViewer'))
    } catch (err) {
      console.warn('[PDF Viewer] Component not available:', err)
      return null
    }
  })

  onMounted(async () => {
    if (!appConfig.stirTheme?.pdf) return
    try {
      const { licenseKey: key } = await $fetch<{ licenseKey: string }>(
        '/api/vpv/license-key',
      )
      licenseKey.value = key
    } catch (err) {
      if (import.meta.dev) {
        console.warn('[PDF Viewer] Failed to fetch license key:', err)
      }
    }
  })

  return {
    PdfViewer,
    licenseKey,
  }
}
