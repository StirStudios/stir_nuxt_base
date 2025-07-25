<script setup lang="ts">
import type { WebformFieldProps, WebformState } from '~/types/formTypes'
import {
  CalendarDate,
  DateFormatter,
  getLocalTimeZone,
} from '@internationalized/date'
import { getOffsetString, generateTimeOptions } from '~/utils/dateUtils'

const { webform } = useAppConfig().stirTheme
const isMaterial = computed(() => webform.variant === 'material')

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

  blocks.value.forEach((block) => {
    const value =
      block.date && block.start
        ? `${block.date.toString()}T${block.start}:00${offset}`
        : ''

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
    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
      <template v-for="(block, i) in blocks" :key="i">
        <UFormField
          v-if="multiple > 1"
          :label="`${field['#title']} ${i + 1}`"
          :required="!!field['#required']"
        >
          <UPopover :class="{ 'w-full': isMaterial }">
            <UButton
              :aria-label="block.date ? 'Change date' : 'Select date'"
              icon="i-lucide-calendar"
              size="md"
              :variant="webform.variant"
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

        <UPopover v-else :class="{ 'w-full': isMaterial }">
          <UButton
            :aria-label="block.date ? 'Change date' : 'Select date'"
            icon="i-lucide-calendar"
            size="md"
            :variant="webform.variant"
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

        <UFormField :label="`Time ${i + 1}`" :required="!!field['#required']">
          <FieldSelect
            v-model="block.start"
            :field-name="`${fieldName}-${i}-start`"
            :items="timeSelectOptions"
            placeholder="Select time"
            :state="{}"
          />
        </UFormField>
      </template>
    </div>
  </div>
</template>
