export function usePdfViewer() {
  const licenseKey = useRuntimeConfig().public.pdfLicenseKey
  return { licenseKey }
}
