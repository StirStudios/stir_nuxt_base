export function transformPayloadToSnakeCase<T extends Record<string, unknown>>(
  payload: T,
): Record<string, unknown> {
  const result: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(payload)) {
    const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase()

    if (value === null || value === undefined) {
      result[snakeKey] = value
      continue
    }

    // Normalize address object
    if (
      typeof value === 'object' &&
      value !== null &&
      'address' in value &&
      typeof (value as Record<string, unknown>)?.address === 'string'
    ) {
      const address = value as Record<string, unknown>
      result[snakeKey] = {
        address: address.address || '',
        address_2: address.address_2 || '',
        city: address.city || '',
        state_province: address.stateProvince || '',
        postal_code: address.postalCode || '',
        country: address.country || '',
      }
      continue
    }

    // Normalize objects as checkbox groups
    if (typeof value === 'object' && !Array.isArray(value)) {
      const values = Object.values(value)
      result[snakeKey] = values
        .map((v) =>
          typeof v === 'string'
            ? v.replace(/([A-Z])/g, '_$1').toLowerCase()
            : v,
        )
        .filter(Boolean) // Optional: skip empty
      continue
    }

    // Normalize array values (checkboxes, multi-selects)
    if (Array.isArray(value)) {
      result[snakeKey] = value
        .map((v) =>
          typeof v === 'string'
            ? v.replace(/([A-Z])/g, '_$1').toLowerCase()
            : v,
        )
        .filter(Boolean)
      continue
    }

    // Normalize booleans (for single checkboxes)
    if (typeof value === 'boolean') {
      result[snakeKey] = value ? '1' : '0'
      continue
    }

    // Normalize strings (radio/select)
    if (typeof value === 'string') {
      result[snakeKey] = value
      continue
    }

    // Default passthrough
    result[snakeKey] = value
  }

  return result
}
