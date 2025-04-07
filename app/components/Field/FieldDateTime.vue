<script setup lang="ts">
import type { WebformFieldProps, WebformState } from '~/types/formTypes'
import {
  CalendarDate,
  DateFormatter,
  getLocalTimeZone,
} from '@internationalized/date'

// Drupal offset: e.g., -0700
function getOffsetString() {
  const offsetMinutes = new Date().getTimezoneOffset() * -1
  const sign = offsetMinutes >= 0 ? '+' : '-'
  const abs = Math.abs(offsetMinutes)
  const hours = String(Math.floor(abs / 60)).padStart(2, '0')
  const minutes = String(abs % 60).padStart(2, '0')
  return `${sign}${hours}${minutes}`
}

// Generate 12-hour format dropdowns
function generateTimeOptions(min: string, max: string, step: number) {
  const times = []
  const [minH, minM] = min.split(':').map(Number)
  const [maxH, maxM] = max.split(':').map(Number)

  const current = new Date()
  current.setHours(minH, minM, 0, 0)
  const end = new Date()
  end.setHours(maxH, maxM, 0, 0)

  while (current <= end) {
    const h = current.getHours().toString().padStart(2, '0')
    const m = current.getMinutes().toString().padStart(2, '0')
    const value = `${h}:${m}`
    const hour12 = current.getHours() % 12 || 12
    const suffix = current.getHours() >= 12 ? 'PM' : 'AM'
    const label = `${hour12}:${m} ${suffix}`
    times.push({ value, label })
    current.setSeconds(current.getSeconds() + step)
  }

  return times
}

const props = defineProps<{
  field: WebformFieldProps
  fieldName: string
  state: WebformState
}>()

const df = new DateFormatter('en-US', { dateStyle: 'medium' })
const multiple = Number(props.field['#multiple']) || 1
const minTime = props.field['#dateTimeMin'] ?? '10:00:00'
const maxTime = props.field['#dateTimeMax'] ?? '22:00:00'
const step = Number(props.field['#dateTimeStep']) || 1800

const timeOptions = generateTimeOptions(minTime, maxTime, step)
const timeSelectOptions = Object.fromEntries(
  timeOptions.map((t) => [t.value, t.label]),
)

type DateTimeBlock = {
  date: CalendarDate | null
  start: string
}

const blocks = ref<DateTimeBlock[]>(
  Array.from({ length: multiple }, (_, i) => {
    const stored = props.state[`${props.fieldName}-${i}`] ?? ''
    let date: CalendarDate | null = null
    let start = timeOptions[0]?.value ?? '00:00'

    if (typeof stored === 'string' && stored.includes('T')) {
      const [dateStr, timeStr] = stored.split('T')
      const [y, m, d] = dateStr.split('-').map(Number)
      if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
        date = new CalendarDate(y, m, d)
      }

      const [sH, sM] = (timeStr || '').split(':')
      if (sH && sM) start = `${sH}:${sM}`
    }

    return { date, start }
  }),
)

watchEffect(() => {
  const offset = getOffsetString()
  const values: string[] = []

  blocks.value.forEach((block, i) => {
    const value =
      block.date && block.start
        ? `${block.date.toString()}T${block.start}:00${offset}`
        : ''

    props.state[`${props.fieldName}-${i}`] = value
    if (value) values.push(value)
  })

  if (!Array.isArray(props.state[props.fieldName])) {
    props.state[props.fieldName] = []
  }

  props.state[props.fieldName] = values
})
</script>

<template>
  <div class="space-y-6">
    <template v-for="(block, i) in blocks" :key="i">
      <div class="flex items-center gap-4">
        <UFormField v-if="multiple > 1" :label="`${field['#title']} ${i + 1}`">
          <UPopover>
            <UButton
              :aria-label="block.date ? 'Change date' : 'Select date'"
              class="w-full text-(--ui-text-muted)"
              color="neutral"
              icon="i-lucide-calendar"
              size="md"
              variant="subtle"
            >
              {{
                block.date
                  ? df.format(block.date.toDate(getLocalTimeZone()))
                  : 'Select Date'
              }}
            </UButton>
            <template #content>
              <UCalendar v-model="block.date" class="p-2" />
            </template>
          </UPopover>
        </UFormField>

        <UPopover v-else>
          <UButton
            :aria-label="block.date ? 'Change date' : 'Select date'"
            class="w-full text-(--ui-text-muted)"
            color="neutral"
            icon="i-lucide-calendar"
            size="md"
            variant="subtle"
          >
            {{
              block.date
                ? df.format(block.date.toDate(getLocalTimeZone()))
                : 'Select Date'
            }}
          </UButton>
          <template #content>
            <UCalendar v-model="block.date" class="p-2" />
          </template>
        </UPopover>

        <UFormField label="Time">
          <FieldSelect
            v-model="block.start"
            :field-name="`${fieldName}-${i}-start`"
            :items="timeSelectOptions"
            placeholder="Select time"
            :state="state"
          />
        </UFormField>
      </div>
    </template>
  </div>
</template>
