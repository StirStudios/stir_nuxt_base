export function usePdfViewer() {
  const licenseKey = ref('')

  onMounted(async () => {
    try {
      const { licenseKey: key } = await $fetch<{ licenseKey: string }>(
        '/api/vpv/license-key',
      )
      licenseKey.value = key
    } catch (err) {
      if (import.meta.dev)
        console.warn('[PDF Viewer] Failed to fetch license key:', err)
    }
  })

  return {
    licenseKey,
  }
}
