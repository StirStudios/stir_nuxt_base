import type { WebformFieldProps, WebformState } from '~/types/FormTypes'

interface VisibilityCondition {
  [selector: string]: { value: string }
}

interface States {
  visible?: (VisibilityCondition | 'or')[] | VisibilityCondition
  disabled?: (VisibilityCondition | 'or')[] | VisibilityCondition
  checked?: (VisibilityCondition | 'or')[] | VisibilityCondition
}

/**
 * Safely access nested properties in a state object using dot notation.
 * If it's an array, we check for inclusion instead of direct access.
 */
const getNestedStateValue = (state: Record<string, any>, path: string) => {
  const parts = path.split('.')
  let current = state

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
      current = current[part]
    } else {
      return false
    }
  }
  return current
}

/**
 * Extract the field name from the selector.
 * Example: ':input[name="vendorElc[upTo_65]"]' → 'vendorElc.upTo_65'
 */
const extractFieldName = (selector: string): string | null => {
  const match = selector.match(/name="(.+?)"/)
  return match ? match[1].replace(/\[([^\]]+)\]/g, '.$1') : null
}

/**
 * Normalize the string to handle casing and underscores consistently.
 */
const normalizeValue = (value: string): string => {
  return value.replace(/([A-Z])/g, '_$1').toLowerCase()
}

/**
 * Checks if the current value matches the condition value.
 */
const matchesCondition = (
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

  return (
    normalizeValue(currentValue.toString()) ===
    normalizeValue(valueCondition.value)
  )
}

/**
 * Main evaluation function that checks conditions against the state.
 */
const evaluateCondition = (
  condition: States['visible'],
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

      const [selector, valueCondition] = Object.entries(entry)[0] ?? []
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

/**
 * useEvaluateState
 *
 * A composable to evaluate the visibility, disabled, and checked states
 * based on the `#states` conditions and current form state.
 */
export function useEvaluateState(
  states: States,
  state: Record<string, unknown>,
) {
  const visible = computed(() => evaluateCondition(states.visible, state, true))

  // We don't need "disabled" anymore, as we bind to "!checked" directly
  const checked = computed(() =>
    evaluateCondition(states.checked, state, false),
  )

  // Returning only the properties we need
  return {
    visible,
    checked,
  }
}

export function evaluateContainerVisibility(
  containerName: string,
  state: WebformState,
  fields: Record<string, WebformFieldProps>,
  getGroupFields: (parentName: string) => string[],
): boolean {
  return getGroupFields(containerName).some((fieldName) => {
    const { visible } = useEvaluateState(
      fields[fieldName]?.['#states'] || {},
      state,
    )
    return visible.value
  })
}
