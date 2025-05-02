import type { WebformFieldProps } from '~/types/formTypes'

interface GroupField extends WebformFieldProps {
  '#type': 'section' | 'fieldset' | 'details' | 'webform_section'
  '#title': string
  '#description'?: string
  '#maxSelected'?: number
  children?: Record<string, WebformFieldProps>
}

interface FlattenedField extends WebformFieldProps {
  parent: string | null
  parentTitle?: string | null
  parentDescription?: string | null
  parentMaxSelected?: number | null
}

export function flattenWebformFields(
  fields: Record<string, WebformFieldProps>,
  parentKey: string | null = null,
  parentTitle: string | null = null,
  parentDescription: string | null = null,
  parentMaxSelected: number | null = null,
): Record<string, FlattenedField> {
  const flat: Record<string, FlattenedField> = {}

  for (const [key, field] of Object.entries(fields)) {
    if (!field || typeof field !== 'object') continue

    const type = field['#type']
    const isGroup = [
      'section',
      'fieldset',
      'details',
      'webform_section',
    ].includes(type)

    const hasChildren =
      'children' in field ||
      Object.values(field).some(
        (v): v is WebformFieldProps =>
          typeof v === 'object' && v !== null && '#type' in v,
      )

    if (isGroup && hasChildren) {
      const group = field as GroupField

      const groupChildren =
        group.children ??
        (Object.fromEntries(
          Object.entries(group).filter(
            ([k, v]) =>
              typeof v === 'object' &&
              v !== null &&
              '#type' in v &&
              !k.startsWith('#'),
          ),
        ) as Record<string, WebformFieldProps>)

      if (type === 'section') {
        flat[key] = {
          ...group,
          parent: parentKey,
        }
      }

      const newParentKey = type === 'section' ? key : parentKey
      const newTitle = type === 'section' ? group['#title'] : parentTitle
      const newDesc =
        type === 'section' ? group['#description'] : parentDescription
      const newMax =
        type === 'section' ? group['#maxSelected'] : parentMaxSelected

      const nested = flattenWebformFields(
        groupChildren,
        newParentKey,
        newTitle,
        newDesc,
        newMax,
      )
      Object.assign(flat, nested)
    } else {
      flat[key] = {
        ...field,
        parent: parentKey,
        parentTitle,
        parentDescription,
        parentMaxSelected,
      }
    }
  }

  return flat
}
