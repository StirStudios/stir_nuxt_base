<script setup lang="ts">
import type { WebformFieldProps } from '~/types'
import { transformOptions } from '~/utils/transformUtils'
import { useEventBus } from '@vueuse/core'

const props = defineProps<{
  field?: WebformFieldProps
  fieldName: string
  state: Record<string, string>
  items?: Record<string, string>
  placeholder?: string
}>()

const { webform } = useAppConfig().stirTheme

// Initialize Event Bus
const tabBus = useEventBus<string>('tab-changed')

onMounted(() => {
  props.state[props.fieldName] ??= props.field?.['#defaultValue'] ?? ''
})

// Revert to default if the value is cleared
watch(
  () => props.state[props.fieldName],
  (newVal) => {
    if (!newVal) {
      props.state[props.fieldName] = props.field?.['#defaultValue'] ?? ''
    }
  },
  { immediate: true },
)

// Compute select items only when dependencies change
const selectItems = computed(() => {
  if (Array.isArray(props.items)) return props.items
  if (props.items && typeof props.items === 'object') {
    return transformOptions(props.items)
  }
  return props.field ? transformOptions(props.field['#options'] ?? {}) : []
})

// Determine button rendering mode
const renderAsButtons = computed(() => props.fieldName === 'tabs')

// Handle button click and emit tab change event
const handleButtonClick = (value: string) => {
  props.state[props.fieldName] = value
  tabBus.emit(value)
}
</script>

<template>
  <template v-if="renderAsButtons">
    <div class="flex flex-wrap gap-2">
      <UButton
        v-for="item in selectItems"
        :key="item.value"
        :active="state[fieldName] === item.value"
        active-color="primary"
        active-variant="solid"
        :label="item.label"
        :variant="webform.variant"
        @click="handleButtonClick(item.value)"
      />
    </div>
  </template>
  <USelect
    v-else
    v-model="state[fieldName]"
    class="w-full"
    :items="selectItems"
    :placeholder="placeholder || 'Select'"
    :variant="webform.variant"
  />
</template>
