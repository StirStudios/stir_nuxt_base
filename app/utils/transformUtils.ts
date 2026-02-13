import { toSnakeCase } from './stringUtils'

export function transformOptions(
  options: Record<string, string | { label: string; description?: string }>,
) {
  return Object.entries(options).map(([value, option]) => {
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

export function transformPayloadToSnakeCase<T extends Record<string, unknown>>(
  payload: T,
): Record<string, unknown> {
  const result: Record<string, unknown> = {}

  Object.entries(payload).forEach(([key, value]) => {
    const snakeKey = toSnakeCase(key)

    if (value === null || value === undefined) {
      result[snakeKey] = value
      return
    }

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

    if (typeof value === 'object' && !Array.isArray(value)) {
      result[snakeKey] = Object.values(value)
        .map((v) => (typeof v === 'string' ? toSnakeCase(v) : v))
        .filter(Boolean)
      return
    }

    if (Array.isArray(value)) {
      result[snakeKey] = value
        .map((v) => {
          if (typeof v !== 'string') return v

          if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{4}$/.test(v)) return v

          return toSnakeCase(v)
        })
        .filter(Boolean)
      return
    }

    if (typeof value === 'boolean') {
      result[snakeKey] = value ? '1' : '0'
      return
    }

    if (typeof value === 'string') {
      result[snakeKey] = value
      return
    }

    result[snakeKey] = value
  })

  return result
}
