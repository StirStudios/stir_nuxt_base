export function transformOptions(
  options: Record<string, string | { label: string; description?: string }>,
) {
  return Object.entries(options).map(([value, option]) => ({
    value,
    label: typeof option === 'string' ? option : option.label,
    description:
      typeof option === 'object' && option.description
        ? option.description
        : '',
  }))
}
