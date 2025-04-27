export function usePdfViewer() {
  const licenseKey = useState<string>('pdf-license-key', () => '')
  return { licenseKey }
}
