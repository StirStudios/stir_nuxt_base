import type { WebformFieldProps } from '~/types/formTypes'

interface SectionField extends WebformFieldProps {
  '#type': 'section'
  '#title': string
  '#description'?: string
  '#maxSelected'?: number
  children: Record<string, unknown>
}

interface FlattenedField extends WebformFieldProps {
  parent: string | null
  parentTitle?: string
  parentDescription?: string
  parentMaxSelected?: number
}

export function flattenWebformFields(
  fields: Record<string, unknown>,
  parentKey: string | null = null,
  parentTitle: string | null = null,
  parentDescription: string | null = null,
  parentMaxSelected: number | null = null,
): Record<string, FlattenedField> {
  const result: Record<string, FlattenedField> = {}

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
      const flatChildren = flattenWebformFields(
        section.children,
        key,
        section['#title'] || key,
        section['#description'] || '',
        section['#maxSelected'] ?? null,
      )
      Object.assign(result, flatChildren)
    } else {
      result[fieldKey] = {
        ...typedField,
        parent: parentKey,
        parentTitle: parentTitle || undefined,
        parentDescription: parentDescription || undefined,
        parentMaxSelected: parentMaxSelected ?? undefined,
      }
    }
  }

  return result
}
