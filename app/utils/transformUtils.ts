import { toSnakeCase } from '~/utils/stringUtils'

/**
 * Transforms an options object into an array of option objects.
 * @param options - The options object to transform.
 * @returns An array of option objects with value, label, and description.
 */
export function transformOptions(
  options: Record<string, string | { label: string; description?: string }>,
) {
  return Object.entries(options).map(([value, option]) => {
    // 🏷️ Type Guard to ensure it's an object with the expected properties
    const isObjectOption = (
      obj: string | { label: string; description?: string },
    ): obj is { label: string; description?: string } =>
      typeof obj === 'object' && obj !== null && 'label' in obj

    return {
      value,
      label: isObjectOption(option) ? option.label : option,
      description: isObjectOption(option) ? (option.description ?? '') : '',
    }
  })
}

/**
 * Transforms a payload object to snake_case keys.
 * @param payload - The object to transform.
 * @returns The object with snake_case keys.
 */
export function transformPayloadToSnakeCase<T extends Record<string, unknown>>(
  payload: T,
): Record<string, unknown> {
  const result: Record<string, unknown> = {}

  Object.entries(payload).forEach(([key, value]) => {
    // Use our utility function instead of regex
    const snakeKey = toSnakeCase(key)

    if (value === null || value === undefined) {
      result[snakeKey] = value
      return
    }

    // Address normalization
    if (
      typeof value === 'object' &&
      value !== null &&
      'address' in value &&
      typeof (value as Record<string, unknown>)?.address === 'string'
    ) {
      const address = value as Record<string, unknown>
      result[snakeKey] = {
        address: address.address ?? '',
        address_2: address.address_2 ?? '',
        city: address.city ?? '',
        state_province: address.stateProvince ?? '',
        postal_code: address.postalCode ?? '',
        country: address.country ?? '',
      }
      return
    }

    // Object normalization (checkbox groups)
    if (typeof value === 'object' && !Array.isArray(value)) {
      result[snakeKey] = Object.values(value)
        .map((v) => (typeof v === 'string' ? toSnakeCase(v) : v))
        .filter(Boolean)
      return
    }

    // Array normalization (multi-selects, checkboxes)
    if (Array.isArray(value)) {
      result[snakeKey] = value
        .map((v) => {
          if (typeof v !== 'string') return v

          // Skip ISO timestamps like 2025-07-12T10:00:00-0700
          if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{4}$/.test(v)) return v

          return toSnakeCase(v)
        })
        .filter(Boolean)
      return
    }

    // Boolean normalization
    if (typeof value === 'boolean') {
      result[snakeKey] = value ? '1' : '0'
      return
    }

    // String passthrough
    if (typeof value === 'string') {
      result[snakeKey] = value
      return
    }

    // Default passthrough
    result[snakeKey] = value
  })

  return result
}
