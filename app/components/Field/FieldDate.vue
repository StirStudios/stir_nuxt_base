<script setup lang="ts">
import type { WebformFieldProps, WebformState } from '~/types/formTypes'
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
    if (!Array.isArray(props.state[props.fieldName])) {
      props.state[props.fieldName] = []
    }
    props.state[props.fieldName] = formatted
  }
})
</script>

<template>
  <div v-if="multiple" class="space-y-6">
    <template v-for="(model, i) in models" :key="i">
      <UFormField
        :label="`${field['#title']} ${i + 1}`"
        :required="!!field['#required']"
      >
        <UPopover :class="{ 'w-full': isMaterial }">
          <UButton
            icon="i-lucide-calendar"
            size="md"
            :variant="webform.variant"
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
    </template>
  </div>

  <UPopover v-else :class="{ 'w-full': isMaterial }">
    <UButton icon="i-lucide-calendar" size="md" :variant="webform.variant">
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
