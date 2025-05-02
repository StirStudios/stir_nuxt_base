import type { WebformFieldProps } from '~/types/formTypes'

interface GroupField extends WebformFieldProps {
  '#type': 'section' | 'fieldset'
  '#title': string
  '#description'?: string
  '#maxSelected'?: number
  children?: Record<string, unknown>
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
  parentTitle: string | undefined = undefined,
  parentDescription: string | undefined = undefined,
  parentMaxSelected: number | undefined = undefined,
): Record<string, FlattenedField> {
  const result: Record<string, FlattenedField> = {}

  for (const [key, rawField] of Object.entries(fields)) {
    if (!rawField || typeof rawField !== 'object' || Array.isArray(rawField))
      continue

    const typedField = rawField as WebformFieldProps
    const fieldKey = typedField['#name'] || key
    const type = typedField['#type']

    const isGroup = type === 'section' || type === 'fieldset'
    const hasChildren =
      'children' in typedField ||
      Object.values(typedField).some(
        (v): v is WebformFieldProps =>
          typeof v === 'object' && v !== null && '#type' in v,
      )

    if (isGroup && hasChildren) {
      const group = typedField as GroupField

      // Add the group itself to flattened output
      result[fieldKey] = {
        ...typedField,
        parent: parentKey,
        parentTitle:
          group['#type'] === 'fieldset' ? group['#title'] : undefined,
        parentDescription:
          group['#type'] === 'fieldset' ? group['#description'] : undefined,
        parentMaxSelected: group['#maxSelected'],
      }

      // Support both `children` and implicit field-like keys
      const childEntries: Record<string, unknown> =
        group.children ??
        Object.fromEntries(
          Object.entries(group).filter(
            ([_k, v]) => typeof v === 'object' && v !== null && '#type' in v,
          ),
        )

      const flatChildren = flattenWebformFields(
        childEntries,
        fieldKey,
        group['#title'],
        group['#description'],
        group['#maxSelected'],
      )

      Object.assign(result, flatChildren)
    } else {
      result[fieldKey] = {
        ...typedField,
        parent: parentKey,
        parentTitle,
        parentDescription,
        parentMaxSelected,
      }
    }
  }

  return result
}
