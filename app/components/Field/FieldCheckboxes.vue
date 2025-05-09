<script setup lang="ts">
import type { WebformFieldProps, WebformState } from '~/types/formTypes'
import { cleanHTML } from '~/utils/cleanHTML'
import { useEventBus } from '@vueuse/core'

const props = defineProps<{
  field: WebformFieldProps
  fieldName: string
  state: WebformState
}>()

const descriptionContent = shallowRef<string>('')
const tabBus = useEventBus<string>('tab-changed')

// Initialize on mount
onMounted(() => {
  if (!Array.isArray(props.state[props.fieldName])) {
    props.state[props.fieldName] = []
  }
  descriptionContent.value = cleanHTML(props.field['#description'] || '')

  // Listen for tab change and clear checkboxes if visibility condition fails
  tabBus.on(handleTabChange)

  // Enforce the max limit and disabled state on initial load
  handleModelUpdate(props.state[props.fieldName])
})

// Determines if the field should be visible for the selected tab.
const isVisibleForTab = (tabValue: string): boolean => {
  const visibility = props.field['#states']?.visible ?? []
  return visibility.some(
    (condition: VisibilityCondition | 'or') =>
      typeof condition === 'object' &&
      condition[':input[name="tabs"]']?.value === tabValue,
  )
}

/**
 * Clears checkboxes if the field is not visible for the selected tab
 */
const handleTabChange = (tabValue: string) => {
  if (!props.field['#states']?.visible) return
  if (!isVisibleForTab(tabValue)) {
    props.state[props.fieldName] = []
  }
}

const guestCount = computed(() => {
  return Number(props.state['venueGuestCount'] || 0)
})

// Computed Property to Transform Options
// This respects `disabled` state based on the guest count range
const items = computed(() => {
  return Object.entries(props.field['#options'] || {}).map(([key, label]) => {
    const optionProps = props.field['#optionProperties']?.[key] || {}
    const [min, max] = optionProps.range || []

    // Disable logic: if min/max are defined and guest count is out of range
    const disabled =
      (min && guestCount.value < min) || (max && guestCount.value > max)

    return {
      label,
      value: key,
      props: {
        ...optionProps,
        disabled,
      },
      disabled, // <- Add this directly to the item itself
    }
  })
})

/**
 * Enforces the group limit for checkboxes within the same group
 */
const enforceGroupLimit = (val: string[]): string[] => {
  const group = props.field['#group']
  const groupLimit = props.field['#groupMaxSelected']

  if (!group || groupLimit !== 1) return val

  // Loop through all other fields in the group and untick them
  for (const [key, _val] of Object.entries(props.state)) {
    const otherField = (
      webformState.fields as Record<string, WebformFieldProps>
    )[key]
    if (
      key !== props.fieldName &&
      otherField?.['#group'] === group &&
      Array.isArray(props.state[key]) &&
      props.state[key].length > 0
    ) {
      props.state[key] = []
    }
  }

  // If more than 1 is selected, keep only the latest selection
  if (val.length > 1) {
    return [val[val.length - 1]]
  }

  return val
}

/**
 * Enforces the maximum selections allowed
 */
const enforceMaxSelected = (val: string[]): string[] => {
  const max = props.field['#maxSelected'] ?? Infinity

  if (val.length > max) {
    // Drop the first ones in the array and keep the newest
    const itemsToKeep = val.slice(-max)
    return itemsToKeep
  }

  return val
}

/**
 * Handle Model Update:
 * - Enforce the group limit
 * - Enforce the max selections
 */
const handleModelUpdate = (val: string[]) => {
  let limitedValues = enforceGroupLimit(val)
  limitedValues = enforceMaxSelected(limitedValues)
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
      <span :class="{ 'text-gray-400': item.props.disabled }">{{
        item.label
      }}</span>
      <span v-if="item.props.description">{{ item.props.description }}</span>
      <span
        v-if="item.props.price"
        class="extra"
        :class="{ 'text-gray-400': item.props.disabled }"
      >
        ${{ item.props.price.toLocaleString() }}
      </span>
    </template>
  </UCheckboxGroup>
</template>
