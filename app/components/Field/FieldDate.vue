<script setup lang="ts">
import type { WebformFieldProps, WebformState } from '~/types'
import {
  CalendarDate,
  DateFormatter,
  getLocalTimeZone,
} from '@internationalized/date'

const { webform } = useAppConfig().stirTheme
const isMaterial = computed(() => webform.variant === 'material')

const props = defineProps<{
  field: WebformFieldProps
  fieldName: string
  state: WebformState
}>()

const df = new DateFormatter('en-US', { dateStyle: 'medium' })
const max = Number(props.field['#multiple']) || 1

// Init model from stored state
const models = ref<CalendarDate[]>([])
const stored = props.state[props.fieldName]

if (Array.isArray(stored)) {
  models.value = stored
    .map((val) => {
      const [y, m, d] = val.split('T')[0].split('-').map(Number)
      return y && m && d ? new CalendarDate(y, m, d) : null
    })
    .filter(Boolean) as CalendarDate[]
} else if (typeof stored === 'string' && stored.includes('-')) {
  const [y, m, d] = stored.split('T')[0].split('-').map(Number)
  if (y && m && d) {
    models.value = [new CalendarDate(y, m, d)]
  }
}

// Sync state when models change
watchEffect(() => {
  // Enforce max limit
  if (models.value.length > max) {
    models.value = models.value.slice(0, max)
  }

  const values = models.value
    .map((model) => model?.toString?.() ?? '')
    .filter(Boolean)

  props.state[props.fieldName] = max > 1 ? values : (values[0] ?? '')
})
</script>

<template>
  <UPopover :class="{ 'w-full': isMaterial }">
    <UButton icon="i-lucide-calendar" size="md" :variant="webform.variant">
      {{
        models.length
          ? models
              .map((m) => df.format(m.toDate(getLocalTimeZone())))
              .join(', ')
          : 'Select Date(s)'
      }}
    </UButton>
    <template #content>
      <UCalendar v-model="models" class="p-2" multiple />
    </template>
  </UPopover>
</template>
