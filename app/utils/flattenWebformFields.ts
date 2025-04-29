import type { WebformFieldProps } from '~/types/formTypes'

export function flattenWebformFields(
  fields: Record<string, any>,
  parentKey: string | null = null,
): Record<string, any> {
  const result: Record<string, any> = {}

  for (const [key, field] of Object.entries(fields)) {
    const fieldKey = field['#name'] || key
    const parentTitle = field['#title'] || parentKey || null

    // Preserve the section wrapper key
    if (field['#type'] === 'section' && field.children) {
      // Recursively flatten children
      const flatChildren = flattenWebformFields(field.children, parentTitle)
      Object.assign(result, flatChildren)
    } else {
      result[fieldKey] = {
        ...field,
        parent: parentKey,
      }
    }
  }

  return result
}
