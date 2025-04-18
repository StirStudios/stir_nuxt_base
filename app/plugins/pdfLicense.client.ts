export default defineNuxtPlugin(async () => {
  const licenseKey = useState<string>('pdf-license-key', () => '')

  if (!licenseKey.value) {
    const { data } = await useFetch<{ licenseKey: string }>(
      '/api/vpv/license-key',
    )
    licenseKey.value = data.value?.licenseKey ?? ''
  }
})
