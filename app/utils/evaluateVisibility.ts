export function evaluateVisibility(
  states: Record<string, any>,
  state: Record<string, any>,
): boolean {
  if (!states || Object.keys(states).length === 0) {
    return true // No visibility conditions, always visible
  }

  const conditions = states.visible || []

  // If the conditions are an array, process them with support for XOR/OR logic
  if (Array.isArray(conditions)) {
    let lastResult: boolean | null = null
    let operator: string | null = null

    for (const condition of conditions) {
      if (typeof condition === 'string' && ['xor', 'or'].includes(condition)) {
        operator = condition // Store the logical operator
        continue
      }

      // Evaluate the current condition
      const [selector, rule] = Object.entries(condition)[0]
      const targetFieldName = selector.match(/name="(.+?)"/)?.[1] || ''
      const currentValue = state[targetFieldName] ?? ''

      let result =
        rule.value === 'any' ? currentValue !== '' : currentValue === rule.value

      // Combine conditions based on the operator
      if (lastResult === null) {
        lastResult = result // Set initial result
      } else if (operator === 'xor') {
        lastResult = (lastResult && !result) || (!lastResult && result) // XOR logic
      } else if (operator === 'or') {
        lastResult = lastResult || result // OR logic
      }
    }

    return lastResult ?? true // Return combined result
  }

  // Handle non-array conditions (fallback for older cases)
  for (const [selector, condition] of Object.entries(conditions)) {
    const targetFieldName = selector.match(/name="(.+?)"/)?.[1] || ''
    const currentValue = state[targetFieldName] ?? ''

    if (condition.value === 'any') {
      if (!currentValue) return false
    } else if (currentValue !== condition.value) {
      return false
    }
  }

  return true // All conditions met
}
