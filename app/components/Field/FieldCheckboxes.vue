<script setup lang="ts">
import type { WebformFieldProps, WebformState } from '~/types'
import { cleanHTML } from '~/utils/cleanHTML'
import { useEventBus } from '@vueuse/core'
import { handleTabChange } from '~/utils/visibilityUtils'
import { enforceGroupLimit, enforceMaxSelected } from '~/utils/selectionUtils'
import { normalizeValue } from '~/utils/stringUtils'

const props = defineProps<{
  field: WebformFieldProps
  fieldName: string
  state: WebformState
}>()

const descriptionContent = shallowRef<string>('')
const tabBus = useEventBus<string>('tab-changed')

onMounted(() => {
  if (!Array.isArray(props.state[props.fieldName])) {
    props.state[props.fieldName] = []
  }
  descriptionContent.value = cleanHTML(props.field['#description'] || '')

  // Listen for tab changes and clear values if not visible
  tabBus.on((tabValue: string) => {
    handleTabChange(
      props.field['#states']?.visible,
      tabValue,
      props.state,
      props.fieldName,
    )
  })

  // Apply model update logic
  handleModelUpdate(props.state[props.fieldName])
})

const getComparisonValue = (key?: string): number | null => {
  if (!key) return null
  const normalizedKey = Object.keys(props.state).find(
    (k) => normalizeValue(k) === normalizeValue(key),
  )
  const val = normalizedKey ? props.state[normalizedKey] : null
  return typeof val === 'number' || typeof val === 'string' ? Number(val) : null
}

const items = computed(() => {
  return Object.entries(props.field['#options'] || {}).map(([key, label]) => {
    const rawProps = props.field['#optionProperties']?.[key] || {}
    const [min, max] = rawProps.range || []
    const compareKey = rawProps.checkAgainst
    const valueToCompare = getComparisonValue(compareKey)

    const disabled =
      valueToCompare !== null &&
      ((typeof min === 'number' && valueToCompare < min) ||
        (typeof max === 'number' && valueToCompare > max))

    return {
      label,
      value: key,
      props: { ...rawProps, disabled },
      disabled,
    }
  })
})

/**
 * Handle Model Update:
 * - Enforce the group limit
 * - Enforce the max selections
 */
const handleModelUpdate = (val: string[]) => {
  let updated = [...val]

  const disabledKeys = new Set(
    items.value.filter((item) => item.disabled).map((item) => item.value),
  )

  for (const selectedKey of val) {
    const meta = props.field['#optionProperties']?.[selectedKey]
    const linked = meta?.linked_to || meta?.linkedTo || []

    for (const linkedKey of linked) {
      if (!updated.includes(linkedKey) && !disabledKeys.has(linkedKey)) {
        updated.push(linkedKey)
      }
    }
  }

  updated = enforceGroupLimit(
    updated,
    props.fieldName,
    props.field['#group'],
    props.field['#groupMaxSelected'],
    props.state,
    webformState,
  )
  updated = enforceMaxSelected(updated, props.field['#maxSelected'])

  props.state[props.fieldName] = updated
}
</script>

<template>
  <UCheckboxGroup
    class="form-input w-full"
    :items="items"
    :model-value="props.state[props.fieldName]"
    @update:model-value="handleModelUpdate"
  >
    <template #label="{ item }">
      <span class="label" :class="{ 'text-muted': item.props.disabled }">
        {{ item.label }}
      </span>
      <span
        v-if="item.props.description"
        :class="{ 'text-muted': item.props.disabled }"
      >
        {{ item.props.description }}
      </span>
      <span
        v-if="item.props.price"
        class="extra"
        :class="{ 'text-muted': item.props.disabled }"
      >
        ${{ item.props.price.toLocaleString() }}
      </span>
    </template>
  </UCheckboxGroup>
</template>
