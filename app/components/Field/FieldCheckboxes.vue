<script setup lang="ts">
import type { WebformFieldProps, WebformState } from '~/types/formTypes'
import { cleanHTML } from '~/utils/cleanHTML'
import { useEventBus } from '@vueuse/core'
import { handleTabChange } from '~/utils/visibilityUtils'
import { enforceGroupLimit, enforceMaxSelected } from '~/utils/selectionUtils'

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

const guestCount = computed(() => {
  return Number(props.state['venueGuestCount'] || 0)
})

const items = computed(() => {
  return Object.entries(props.field['#options'] || {}).map(([key, label]) => {
    const optionProps = props.field['#optionProperties']?.[key] || {}
    const [min, max] = optionProps.range || []

    const disabled =
      (min && guestCount.value < min) || (max && guestCount.value > max)

    return {
      label,
      value: key,
      props: {
        ...optionProps,
        disabled,
      },
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
  let limitedValues = enforceGroupLimit(
    val,
    props.fieldName,
    props.field['#group'],
    props.field['#groupMaxSelected'],
    props.state,
    webformState,
  )
  limitedValues = enforceMaxSelected(limitedValues, props.field['#maxSelected'])
  props.state[props.fieldName] = limitedValues
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
      <span :class="{ 'text-muted': item.props.disabled }">{{
        item.label
      }}</span>
      <span
        v-if="item.props.description"
        :class="{ 'text-muted': item.props.disabled }"
        >{{ item.props.description }}</span
      >
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
