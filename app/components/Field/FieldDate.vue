<script setup lang="ts">
import type { WebformFieldProps, WebformState } from '~/types/formTypes'
import {
  CalendarDate,
  DateFormatter,
  getLocalTimeZone,
} from '@internationalized/date'

const props = defineProps<{
  field: WebformFieldProps
  fieldName: string
  state: WebformState
}>()

const df = new DateFormatter('en-US', { dateStyle: 'medium' })
const multiple = Number(props.field['#multiple']) || 0

const models = ref<CalendarDate[]>([])

for (let i = 0; i < (multiple || 1); i++) {
  const key = multiple ? `${props.fieldName}-${i}` : props.fieldName
  const stored = props.state[key] as string
  if (stored) {
    const [y, m, d] = stored.split('T')[0].split('-').map(Number)
    if (y && m && d) {
      models.value[i] = new CalendarDate(y, m, d)
    } else {
      models.value[i] = null
    }
  } else {
    models.value[i] = null
  }
}

watchEffect(() => {
  const formatted: string[] = []

  models.value.forEach((model, i) => {
    const val = model ? model.toString() : ''
    const key = multiple ? `${props.fieldName}-${i}` : props.fieldName
    props.state[key] = val
    if (val) formatted.push(val)
  })

  if (multiple) {
    props.state[props.fieldName] = formatted
  }
})
</script>

<template>
  <div v-if="multiple" class="space-y-6">
    <div v-for="(model, i) in models" :key="i" class="flex items-center gap-2">
      <UFormField :label="`${field['#title']} ${i + 1}`">
        <UPopover>
          <UButton
            class="w-40 text-(--ui-text-muted)"
            color="neutral"
            icon="i-lucide-calendar"
            size="md"
            variant="subtle"
          >
            {{
              model
                ? df.format(model.toDate(getLocalTimeZone()))
                : 'Select Date'
            }}
          </UButton>
          <template #content>
            <UCalendar v-model="models[i]" class="p-2" />
          </template>
        </UPopover>
      </UFormField>
    </div>
  </div>

  <UPopover v-else>
    <UButton
      class="w-40 text-(--ui-text-muted)"
      color="neutral"
      icon="i-lucide-calendar"
      size="md"
      variant="subtle"
    >
      {{
        models[0]
          ? df.format(models[0].toDate(getLocalTimeZone()))
          : 'Select Date'
      }}
    </UButton>
    <template #content>
      <UCalendar v-model="models[0]" class="p-2" />
    </template>
  </UPopover>
</template>
