export function usePdfViewer() {
  const licenseKey = useState<string | null>('pdf-license-key', () => null)

  if (!licenseKey.value) {
    $fetch<{ licenseKey: string }>('/api/vpv/license-key')
      .then((res) => (licenseKey.value = res.licenseKey))
      .catch((err) => {
        if (import.meta.dev)
          console.warn('[PDF Viewer] Failed to fetch license key:', err)
      })
  }

  return { licenseKey }
}
