import type { WebformFieldProps, WebformState } from '~/types'
import { useEvaluateState } from './useEvaluateState'

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
