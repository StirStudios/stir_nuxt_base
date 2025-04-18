export async function usePdfViewer() {
  const licenseKey = useState<string>('pdf-license-key', () => '')

  // Don't re-fetch if already set
  if (!licenseKey.value && import.meta.client) {
    const { data } = await useFetch<{ licenseKey: string }>(
      '/api/vpv/license-key',
    )
    licenseKey.value = data.value?.licenseKey ?? ''
  }

  return { licenseKey }
}
