import { evaluateCondition } from '~/utils/evaluateUtils'

interface VisibilityCondition {
  [selector: string]: { value: string }
}

interface States {
  visible?: (VisibilityCondition | 'or')[] | VisibilityCondition
  disabled?: (VisibilityCondition | 'or')[] | VisibilityCondition
  checked?: (VisibilityCondition | 'or')[] | VisibilityCondition
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
  const disabled = computed(() =>
    evaluateCondition(states.disabled, state, false),
  )
  const checked = computed(() =>
    evaluateCondition(states.checked, state, false),
  )

  return {
    visible,
    disabled,
    checked,
  }
}
