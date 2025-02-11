export function evaluateVisibility(
  states: Record<string, any>,
  state: Record<string, any>,
): boolean {
  if (!states || !states.visible || states.visible.length === 0) {
    return true // No conditions defined, always visible
  }

  // If 'visible' is an array, handle OR logic
  if (Array.isArray(states.visible)) {
    let lastConditionResult = false
    for (const condition of states.visible) {
      if (condition === 'or') {
        // Continue to next condition
        continue
      }

      const [selector, valueCondition] = Object.entries(condition)[0]
      const targetFieldName = selector.match(/name="(.+?)"/)?.[1]

      if (!targetFieldName) {
        continue // Skip invalid selectors
      }

      const currentValue = state[targetFieldName] ?? ''

      // Handle "any" condition: requires a non-empty value
      if (valueCondition.value === 'any' && currentValue) {
        return true // Show field if any condition matches
      }

      // Handle specific value conditions
      if (currentValue === valueCondition.value) {
        return true // Show field if it matches one of the OR conditions
      }
    }

    return false // Hide field if none of the conditions match
  }

  // Default logic for single conditions
  for (const [selector, valueCondition] of Object.entries(states.visible)) {
    const targetFieldName = selector.match(/name="(.+?)"/)?.[1]

    if (!targetFieldName) {
      continue // Skip invalid selectors
    }

    const currentValue = state[targetFieldName] ?? ''

    // Handle "any" condition: requires a non-empty value
    if (valueCondition.value === 'any' && !currentValue) {
      return false // Hide if empty
    }

    // Handle specific value conditions
    if (currentValue !== valueCondition.value) {
      return false // Hide if value doesn't match
    }
  }

  return true // All conditions met
}
