export function transformPayloadToSnakeCase(
  payload: Record<string, any>,
): Record<string, any> {
  const result: Record<string, any> = {}

  for (const [key, value] of Object.entries(payload)) {
    const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase()

    if (typeof value === 'object' && value !== null) {
      if (value.hasOwnProperty('address')) {
        result[snakeKey] = {
          address: value.address || '',
          address_2: value.address_2 || '',
          city: value.city || '',
          state_province: value.stateProvince || '',
          postal_code: value.postalCode || '',
          country: value.country || '',
        }
      } else {
        result[snakeKey] = transformPayloadToSnakeCase(value)
      }
    } else {
      result[snakeKey] = value
    }
  }

  return result
}
