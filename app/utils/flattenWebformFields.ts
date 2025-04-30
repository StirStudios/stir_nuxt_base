import type { WebformFieldProps } from '~/types/formTypes'

interface SectionField extends WebformFieldProps {
  '#type': 'section'
  '#title': string
  '#description'?: string
  children: Record<string, unknown>
}

export function flattenWebformFields(
  fields: Record<string, unknown>,
  parentKey: string | null = null,
  parentTitle: string | null = null,
  parentDescription: string | null = null,
): Record<
  string,
  WebformFieldProps & {
    parent: string | null
    parentTitle?: string
    parentDescription?: string
  }
> {
  const result: Record<
    string,
    WebformFieldProps & {
      parent: string | null
      parentTitle?: string
      parentDescription?: string
    }
  > = {}

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
      )
      Object.assign(result, flatChildren)
    } else {
      result[fieldKey] = {
        ...typedField,
        parent: parentKey,
        parentTitle: parentTitle || undefined,
        parentDescription: parentDescription || undefined,
      }
    }
  }

  return result
}
