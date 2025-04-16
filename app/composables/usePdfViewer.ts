export function usePdfViewer() {
  const appConfig = useAppConfig()
  const licenseKey = ref('')
  const PdfViewer = shallowRef()

  onMounted(async () => {
    if (!appConfig.stirTheme?.pdf) return

    try {
      const [{ default: Viewer }, { licenseKey: key }] = await Promise.all([
        import('~/components/PdfViewer.client.vue'),
        $fetch<{ licenseKey: string }>('/api/vpv/license-key'),
      ])

      licenseKey.value = key
      PdfViewer.value = markRaw(Viewer)
    } catch (err) {
      if (import.meta.dev) {
        console.warn('[PDF Viewer] Failed to load:', err)
      }
    }
  })

  return {
    PdfViewer,
    licenseKey,
  }
}
