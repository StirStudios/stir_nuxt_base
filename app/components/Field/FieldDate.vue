<script setup lang="ts">
import type { WebformFieldProps } from '~/types/formTypes'
import {
  CalendarDate,
  DateFormatter,
  getLocalTimeZone,
} from '@internationalized/date'

const props = defineProps<{
  field: WebformFieldProps
  fieldName: string
  state: Record<string, string>
}>()

// Initialize date
const today = new Date()
const initialDate = props.state[props.fieldName]
  ? CalendarDate.fromString(props.state[props.fieldName])
  : new CalendarDate(today.getFullYear(), today.getMonth() + 1, today.getDate())

const modelValue = shallowRef(initialDate)

// Date formatter for button display
const df = new DateFormatter('en-US', { dateStyle: 'medium' })

watchEffect(() => {
  props.state[props.fieldName] = modelValue.value.toString()
})
</script>

<template>
  <UPopover>
    <UButton color="neutral" variant="subtle" icon="i-lucide-calendar">
      {{ df.format(modelValue.toDate(getLocalTimeZone())) }}
    </UButton>

    <template #content>
      <UCalendar v-model="modelValue" class="p-2" />
    </template>
  </UPopover>
</template>
