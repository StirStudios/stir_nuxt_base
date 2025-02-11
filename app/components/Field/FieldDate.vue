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

// Initialize date
const [year, month, day] = (props.state[props.fieldName] ?? '')
  .split('-')
  .map(Number)

const modelValue = ref(
  new CalendarDate(
    year || new Date().getFullYear(),
    month || new Date().getMonth() + 1,
    day || new Date().getDate(),
  ),
)

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
