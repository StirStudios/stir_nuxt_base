import { object, string, array, type ObjectSchema, type AnySchema } from 'yup'
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

    // Handle composite fields
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
      const isRequired = field['#required'] === true
      const isEmail = field['#type'] === 'email'
      const isMultiple = '#multiple' in field && !!field['#multiple']

      if (isMultiple) {
        shape[key] = array()
          .of(
            string().when([], {
              is: () => isRequired,
              then: (schema) => schema.required(requiredError),
              otherwise: (schema) => schema,
            }),
          )
          .min(isRequired ? 1 : 0, requiredError)
      } else {
        let base = string().nullable()

        if (isEmail) {
          base = base.email('Invalid email')
        }

        shape[key] = base.when([], {
          is: () => isRequired,
          then: (schema) => schema.required(requiredError),
        })
      }
    }
  }

  return object().shape(shape)
}
