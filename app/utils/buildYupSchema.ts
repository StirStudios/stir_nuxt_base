import { object, string, type ObjectSchema, type AnySchema } from 'yup'
import { evaluateVisibility } from '~/utils/evaluateVisibility'
import type { WebformFieldProps } from '~/types/FormTypes'

export function buildYupSchema(
  fields: Record<string, WebformFieldProps>,
  state: Record<string, unknown>,
): ObjectSchema<Record<string, unknown>> {
  const shape: Record<string, AnySchema> = {}

  for (const [key, field] of Object.entries(fields)) {
    if (
      field['#states']?.visible &&
      !evaluateVisibility(field['#states'], state)
    ) {
      continue
    }

    const requiredError = field['#requiredError'] || 'This field is required'

    if ('#composite' in field && typeof field['#composite'] === 'object') {
      const subShape: Record<string, AnySchema> = {}

      for (const [subKey, subField] of Object.entries(
        field['#composite'] as Record<string, WebformFieldProps>,
      )) {
        subShape[subKey] = string()
          .nullable()
          .when([], {
            is: () => field['#required'] || subField['#required'],
            then: (schema) => schema.required(requiredError),
          })
      }

      shape[key] = object().shape(subShape)
    } else {
      shape[key] = string()
        .nullable()
        .when([], {
          is: () => field['#required'],
          then: (schema) =>
            field['#type'] === 'email'
              ? schema.email('Invalid email').required(requiredError)
              : schema.required(requiredError),
        })
    }
  }

  return object().shape(shape)
}
