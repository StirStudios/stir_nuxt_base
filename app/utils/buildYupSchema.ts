import { object, string, ObjectSchema } from 'yup'
import { evaluateVisibility } from '~/utils/evaluateVisibility'

export function buildYupSchema(
  fields: Record<string, any>,
  state: Record<string, any>,
): ObjectSchema {
  const shape: Record<string, any> = {}

  for (const [key, field] of Object.entries(fields)) {
    if (!evaluateVisibility(field['#states'], state)) continue

    const requiredError = field['#requiredError'] || 'This field is required'

    if (field['#composite']) {
      shape[key] = object().shape(
        Object.fromEntries(
          Object.entries(field['#composite']).map(([subKey, subField]) => [
            subKey,
            string()
              .nullable()
              .when([], {
                is: () => field['#required'] || subField['#required'],
                then: (schema) => schema.required(requiredError),
              }),
          ]),
        ),
      )
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
