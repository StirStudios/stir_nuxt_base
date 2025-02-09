export function transformOptions(options: Record<string, string>) {
  return Object.entries(options).map(([value, label]) => ({ label, value }))
}
