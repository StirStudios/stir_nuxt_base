import type { WebformFieldProps } from '~/types/formTypes'

export function flattenWebformFields(
  fields: Record<string, unknown>,
  parent: string | null = null,
): Record<string, WebformFieldProps> {
  const flatFields: Record<string, WebformFieldProps> = {}

  for (const [key, field] of Object.entries(fields)) {
    if (!field || typeof field !== 'object' || Array.isArray(field)) {
      continue
    }

    const typedField = field as Partial<WebformFieldProps>

    if (typedField['#type']) {
      flatFields[key] = {
        ...typedField,
        parent,
      } as WebformFieldProps & { parent: string | null }
    }

    for (const [childKey, childField] of Object.entries(field)) {
      if (
        !childField ||
        typeof childField !== 'object' ||
        Array.isArray(childField) ||
        childKey.startsWith('#')
      ) {
        continue
      }

      if ((childField as Partial<WebformFieldProps>)['#type']) {
        Object.assign(
          flatFields,
          flattenWebformFields({ [childKey]: childField }, key),
        )
      }
    }
  }

  return flatFields
}
