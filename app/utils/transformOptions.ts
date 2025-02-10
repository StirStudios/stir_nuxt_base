export function transformOptions(
  options: Record<string, { label: string; description: string }>,
) {
  return Object.entries(options).map(([value, { label, description }]) => ({
    value,
    label,
    description,
  }))
}
