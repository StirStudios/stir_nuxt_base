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

const df = new DateFormatter('en-US', { dateStyle: 'medium' })

// Initialize modelValue as null when no date is provided
const modelValue = ref<CalendarDate | null>(null)

const storedDate = props.state[props.fieldName] ?? ''
if (storedDate) {
  const [year, month, day] = storedDate.split('-').map(Number)
  if (year && month && day) {
    modelValue.value = new CalendarDate(year, month, day)
  }
}

// Sync the selected date to external form state
watchEffect(() => {
  props.state[props.fieldName] = modelValue.value
    ? modelValue.value.toString()
    : ''
})
</script>

<template>
  <UPopover>
    <UButton color="neutral" variant="subtle" icon="i-lucide-calendar">
      {{
        modelValue
          ? df.format(modelValue.toDate(getLocalTimeZone()))
          : 'Select Date'
      }}
    </UButton>

    <template #content>
      <UCalendar v-model="modelValue" class="p-2" />
    </template>
  </UPopover>
</template>
