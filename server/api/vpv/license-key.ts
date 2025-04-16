export default defineEventHandler(() => {
  const { vpvLicenseKey } = useRuntimeConfig()
  return { licenseKey: vpvLicenseKey }
})
