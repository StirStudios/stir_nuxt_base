import type { WebformFieldProps } from '~/types/formTypes'

interface SectionField extends WebformFieldProps {
  '#type': 'section'
  children: Record<string, unknown>
}

export function flattenWebformFields(
  fields: Record<string, unknown>,
  parentKey: string | null = null,
): Record<string, WebformFieldProps & { parent: string | null }> {
  const result: Record<string, WebformFieldProps & { parent: string | null }> =
    {}

  for (const [key, field] of Object.entries(fields)) {
    if (!field || typeof field !== 'object' || Array.isArray(field)) continue

    const typedField = field as WebformFieldProps
    const fieldKey = typedField['#name'] || key

    if (
      typedField['#type'] === 'section' &&
      'children' in typedField &&
      typeof (typedField as SectionField).children === 'object'
    ) {
      const section = typedField as SectionField
      const flatChildren = flattenWebformFields(section.children, key)
      Object.assign(result, flatChildren)
    } else {
      result[fieldKey] = {
        ...typedField,
        parent: parentKey,
      }
    }
  }

  return result
}
