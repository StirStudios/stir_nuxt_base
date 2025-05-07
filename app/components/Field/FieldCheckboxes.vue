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

onMounted(() => {
  if (!Array.isArray(props.state[props.fieldName])) {
    props.state[props.fieldName] = []
  }
  descriptionContent.value = cleanHTML(props.field['#description'] || '')

  // Listen for tab change and clear checkboxes if visibility condition fails
  tabBus.on(handleTabChange)
})

// Determines if the field should be visible for the selected tab
const isVisibleForTab = (tabValue: string): boolean => {
  const visibility = props.field['#states']?.visible ?? []
  return visibility.some(
    (condition: VisibilityCondition | 'or') =>
      typeof condition === 'object' &&
      condition[':input[name="tabs"]']?.value === tabValue,
  )
}

// Clears checkboxes if the field is not visible for the selected tab
const handleTabChange = (tabValue: string) => {
  if (!isVisibleForTab(tabValue)) {
    props.state[props.fieldName] = []
  }
}

const maxSelected = computed(() => props.field['#maxSelected'] ?? Infinity)

// Computed Property to Transform Options
const items = computed(() =>
  Object.entries(props.field['#options'] || {}).map(([key, label]) => ({
    label,
    value: key,
    props: props.field['#optionProperties']?.[key] || {},
  })),
)

// Enforces the group limit for checkboxes within the same group
const enforceGroupLimit = (val: string[]): string[] => {
  const group = props.field['#group']
  const groupLimit = props.field['#groupMaxSelected']

  if (!group || groupLimit !== 1) return val

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

  return val
}

watch(
  () => props.state[props.fieldName],
  (val) => {
    if (Array.isArray(val) && val.length > maxSelected.value) {
      props.state[props.fieldName] = val.slice(-maxSelected.value)
    }
  },
)
</script>

<template>
  <UCheckboxGroup
    class="form-input w-full"
    :items="items"
    :model-value="state[fieldName]"
    @update:model-value="
      (val) => {
        state[fieldName] = enforceGroupLimit(val)
      }
    "
  >
    <template #label="{ item }">
      <span>{{ item.label }}</span>
      <span v-if="item.props.description">{{ item.props.description }}</span>
      <span v-if="item.props.price" class="extra">
        ${{ item.props.price.toLocaleString() }}
      </span>
    </template>
  </UCheckboxGroup>
</template>
