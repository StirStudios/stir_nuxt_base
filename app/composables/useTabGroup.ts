import type { WebformFieldProps } from '~/types/formTypes'

export function useTabGroup(
  field: WebformFieldProps,
  fieldName: string,
  fields: Record<string, WebformFieldProps>,
  orderedFieldNames: string[],
) {
  const tabGroup = computed(() => field['#tabGroup'])

  const isFirstInTabGroup = computed(() => {
    if (!tabGroup.value || !orderedFieldNames.length) return false
    return (
      orderedFieldNames.find(
        (key) => fields[key]?.['#tabGroup'] === tabGroup.value,
      ) === fieldName
    )
  })

  const shouldRenderTabs = computed(
    () => !!tabGroup.value && isFirstInTabGroup.value,
  )

  const tabItems = computed<{ label: string; value: string }[]>(() => {
    if (!tabGroup.value) return []
    return orderedFieldNames
      .filter((key) => fields[key]?.['#tabGroup'] === tabGroup.value)
      .map((key) => ({
        label: fields[key]?.['#title'] ?? key,
        value: key,
      }))
  })

  const active: Ref<string> = ref(tabItems.value[0]?.value ?? '')

  return {
    shouldRenderTabs,
    tabItems,
    active,
  }
}
