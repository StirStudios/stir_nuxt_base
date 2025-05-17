import {
  object,
  string,
  number,
  array,
  boolean,
  type ObjectSchema,
  type AnySchema,
  type NumberSchema,
} from 'yup'
import { useEvaluateState } from '~/composables/useEvaluateState'
import type { WebformFieldProps } from '~/types/FormTypes'

export function buildYupSchema(
  fields: Record<string, WebformFieldProps>,
  state: Record<string, unknown>,
): ObjectSchema<Record<string, unknown>> {
  const shape: Record<string, AnySchema> = {}

  for (const [key, field] of Object.entries(fields)) {
    // Use the composable to evaluate visibility
    const { visible } = useEvaluateState(field['#states'] ?? {}, state)

    // Skip if field is not visible
    if (!visible.value) continue

    const requiredError = field['#requiredError'] || 'This field is required'
    const isRequired = field['#required'] === true
    const isEmail = field['#type'] === 'email'
    const isNumber = field['#type'] === 'number'
    const isCheckboxes = field['#type'] === 'checkboxes'
    const isCheckbox = field['#type'] === 'checkbox'
    const isMultiple = '#multiple' in field && !!field['#multiple']

    // Composite object fields
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
      continue
    }

    // Checkboxes group or multiple select
    if (isCheckboxes || isMultiple) {
      let validator = array().of(string())
      if (isRequired) {
        validator = validator.min(1, requiredError).required(requiredError)
      }
      if (field['#minSelected']) {
        validator = validator.min(
          field['#minSelected'],
          `Please select at least ${field['#minSelected']} items`,
        )
      }
      if (field['#maxSelected']) {
        validator = validator.max(
          field['#maxSelected'],
          `You can select up to ${field['#maxSelected']} items`,
        )
      }
      shape[key] = validator
      continue
    }

    // Single checkbox (boolean-like "I agree")
    if (isCheckbox) {
      let checkboxSchema = boolean().oneOf([true], requiredError)

      if (isRequired) {
        checkboxSchema = checkboxSchema.required(requiredError)
      }

      shape[key] = checkboxSchema
      continue
    }

    // Default string/number/tel/email field
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

  return object().shape(shape)
}
