import type { ConditionType, ConditionEntry } from '~/types/FormTypes'
import { getNestedStateValue, matchesCondition } from '~/utils/stateUtils'
import { extractFieldName } from '~/utils/stringUtils'

/**
 * Main evaluation function that checks conditions against the state.
 * It evaluates visibility, disabled, and checked states based on conditions.
 * @param condition - The condition object or array of conditions.
 * @param state - The state of the form fields.
 * @param defaultValue - The default value to return if no condition is met.
 * @returns A boolean indicating if the condition is met.
 */
export const evaluateCondition = (
  condition: ConditionType | undefined,
  state: Record<string, unknown>,
  defaultValue: boolean,
): boolean => {
  if (!condition || (Array.isArray(condition) && condition.length === 0)) {
    return defaultValue
  }

  if (Array.isArray(condition)) {
    let shouldBeVisible = false

    for (const entry of condition) {
      if (entry === 'or') {
        if (shouldBeVisible) return true
        shouldBeVisible = false
        continue
      }

      // Explicitly cast entry to ConditionEntry to avoid `any` typing
      const typedEntry = entry as ConditionEntry

      const [selector, valueCondition] = Object.entries(typedEntry)[0] ?? []
      const targetFieldName = extractFieldName(selector)

      if (!targetFieldName) continue
      if (typeof valueCondition !== 'object') continue

      const currentValue = getNestedStateValue(state, targetFieldName)
      shouldBeVisible = matchesCondition(currentValue, valueCondition)
    }
    return shouldBeVisible
  }

  for (const [selector, valueCondition] of Object.entries(condition)) {
    const targetFieldName = extractFieldName(selector)
    if (!targetFieldName) continue
    if (typeof valueCondition !== 'object') continue

    const currentValue = getNestedStateValue(state, targetFieldName)

    if (!matchesCondition(currentValue, valueCondition)) {
      return false
    }
  }
  return true
}
