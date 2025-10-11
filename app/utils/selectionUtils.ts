import type { WebformFieldProps, WebformState } from '~/types'

/**
 * Enforces the maximum selections within the same vendor (local limit).
 */
export const enforceMaxSelected = (
  val: string[],
  max: number = Infinity,
): string[] => {
  if (val.length > max) {
    // Roll the selection window: Remove the oldest, keep the latest
    return val.slice(val.length - max)
  }
  return val
}

/**
 * Enforces the group limit for checkboxes within the same group.
 */
export const enforceGroupLimit = (
  val: string[],
  fieldName: string,
  group: string | undefined,
  groupLimit: number | undefined,
  state: WebformState,
  webformState: { fields: Record<string, WebformFieldProps> },
): string[] => {
  if (!group || !groupLimit) return val

  // Collect all field names that belong to the same group
  const groupFields = Object.keys(webformState.fields).filter((key) => {
    const field = webformState.fields[key]
    return field && field['#group'] === group
  })

  // Clear selections in other fields of the same group
  groupFields.forEach((key) => {
    if (key !== fieldName && Array.isArray(state[key]) && state[key].length) {
      state[key] = []
    }
  })

  // Apply the max selection limit for the specific field
  const fieldMaxLimit =
    webformState.fields[fieldName]?.['#maxSelected'] ?? Infinity

  return enforceMaxSelected(val, fieldMaxLimit)
}
