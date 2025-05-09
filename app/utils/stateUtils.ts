import type { WebformState } from '~/types/FormTypes'
import { normalizeValue } from '~/utils/stringUtils'

/**
 * Safely access nested properties in a state object using dot notation.
 * If it's an array, we check for inclusion instead of direct access.
 *
 * @param state - The form state object.
 * @param path - The dot notation path to the desired property.
 * @returns The value at the specified path or `false` if not found.
 */
export const getNestedStateValue = (
  state: WebformState,
  path: string,
): unknown | false => {
  const parts = path.split('.')
  let current: unknown = state

  for (const part of parts) {
    if (Array.isArray(current)) {
      if (current.includes(part)) {
        return part
      } else {
        return false
      }
    } else if (typeof current === 'object' && current !== null) {
      if (!(part in current)) {
        return false
      }
      current = (current as Record<string, unknown>)[part]
    } else {
      return false
    }
  }
  return current
}

/**
 * Checks if the current value matches the condition value.
 *
 * @param currentValue - The value from the state to check.
 * @param valueCondition - The expected condition value.
 * @returns A boolean indicating if the condition is met.
 */
export const matchesCondition = (
  currentValue: unknown,
  valueCondition: { value: string },
): boolean => {
  if (valueCondition.value === 'any') return !!currentValue

  if (Array.isArray(currentValue)) {
    return currentValue
      .map(String)
      .map(normalizeValue)
      .includes(normalizeValue(valueCondition.value))
  }

  if (typeof currentValue === 'string') {
    return normalizeValue(currentValue) === normalizeValue(valueCondition.value)
  }

  if (typeof currentValue === 'number') {
    return String(currentValue) === valueCondition.value
  }

  return false
}
