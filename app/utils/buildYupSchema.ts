import {
  object,
  string,
  number,
  array,
  type ObjectSchema,
  type AnySchema,
  type NumberSchema,
} from 'yup'
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
      const isNumber = field['#type'] === 'number'
      const isCheckboxes = field['#type'] === 'checkboxes'
      const isMultiple = '#multiple' in field && !!field['#multiple']

      if (isMultiple || isCheckboxes) {
        // If it's a multiple value field OR checkboxes group, treat it as an array
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
        let base: AnySchema = string().nullable()

        if (isNumber) {
          let numSchema = number()
            .typeError('Must be a number')
            .nullable() as NumberSchema<number | undefined>

          if (field['#min'] !== undefined) {
            numSchema = numSchema.min(
              field['#min'],
              `Minimum value is ${field['#min']}`,
            )
          }

          if (field['#max'] !== undefined) {
            numSchema = numSchema.max(
              field['#max'],
              `Maximum value is ${field['#max']}`,
            )
          }

          base = numSchema
        } else if (isEmail) {
          base = string().nullable().email('Invalid email')
        } else if (field['#type'] === 'tel') {
          base = string()
            .nullable()
            .matches(/^\+?[0-9\s\-().]{7,20}$/, 'Invalid phone number')
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
