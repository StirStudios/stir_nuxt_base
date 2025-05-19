import type { ConditionEntry, WebformState } from '~/types/formTypes'

/**
 * Determines if a field should be visible for the selected tab.
 */
export const isVisibleForTab = (
  visibility: ConditionEntry[] | ConditionEntry | undefined,
  tabValue: string,
): boolean => {
  if (!visibility) return true

  // Normalize to array if it's a single object
  const conditions = Array.isArray(visibility) ? visibility : [visibility]

  return conditions.some((condition) => {
    if (typeof condition === 'object') {
      const tabCondition = condition[':input[name="tabs"]']
      return tabCondition?.value === tabValue
    }
    return false
  })
}

/**
 * Clears values if the field is not visible for the selected tab.
 */
export const handleTabChange = (
  visibility: ConditionEntry[] | ConditionEntry | undefined,
  tabValue: string,
  state: WebformState,
  fieldName: string,
) => {
  if (!visibility) return
  if (!isVisibleForTab(visibility, tabValue)) {
    state[fieldName] = []
  }
}
