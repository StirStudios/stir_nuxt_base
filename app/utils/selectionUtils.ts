import type { WebformFieldProps, WebformState } from '~/types/formTypes'

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
  if (!group || groupLimit !== 1) return val

  for (const [key] of Object.entries(state)) {
    const otherField = webformState.fields[key]
    if (
      key !== fieldName &&
      otherField?.['#group'] === group &&
      Array.isArray(state[key]) &&
      state[key].length > 0
    ) {
      state[key] = []
    }
  }

  if (val.length > 1) {
    return [val[val.length - 1] ?? '']
  }

  return val
}

/**
 * Enforces the maximum selections allowed.
 */
export const enforceMaxSelected = (
  val: string[],
  max: number = Infinity,
): string[] => {
  if (val.length > max) {
    return val.slice(-max)
  }
  return val
}
