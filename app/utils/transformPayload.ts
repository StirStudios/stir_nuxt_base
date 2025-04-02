export function transformPayloadToSnakeCase<T extends Record<string, unknown>>(
  payload: T,
): Record<string, unknown> {
  const result: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(payload)) {
    const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase()

    if (typeof value === 'object' && value !== null) {
      if (Object.prototype.hasOwnProperty.call(value, 'address')) {
        const address = value as Record<string, unknown>
        result[snakeKey] = {
          address: address.address || '',
          address_2: address.address_2 || '',
          city: address.city || '',
          state_province: address.stateProvince || '',
          postal_code: address.postalCode || '',
          country: address.country || '',
        }
      } else {
        result[snakeKey] = transformPayloadToSnakeCase(
          value as Record<string, unknown>,
        )
      }
    } else {
      result[snakeKey] = value
    }
  }

  return result
}
