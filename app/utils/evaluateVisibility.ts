export function evaluateVisibility(
  states: Record<string, any>,
  state: Record<string, any>,
): boolean {
  if (!states || Object.keys(states).length === 0) {
    return true // No conditions defined, always visible
  }

  for (const [selector, condition] of Object.entries(states.visible || {})) {
    const targetFieldName = selector.match(/name="(.+?)"/)?.[1]

    if (!targetFieldName) {
      continue // Skip invalid selectors
    }

    const currentValue = state[targetFieldName] ?? ''

    // Handle "any" condition: requires a non-empty value
    if (condition.value === 'any') {
      if (!currentValue) {
        return false // Hide if empty
      }
      continue // Pass if non-empty
    }

    // Handle specific value conditions
    if (currentValue !== condition.value) {
      return false // Hide if value doesn't match
    }
  }

  return true // All conditions met
}
