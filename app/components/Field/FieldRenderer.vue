<script setup lang="ts">
import type { WebformFieldProps, WebformState } from '~/types/formTypes'
import { cleanHTML } from '~/utils/cleanHTML'
import { evaluateVisibility } from '~/utils/evaluateVisibility'

// Import field components locally
import FieldInput from '@/components/Field/FieldInput'
import FieldTextarea from '@/components/Field/FieldTextarea'
import FieldSelect from '@/components/Field/FieldSelect'
import FieldRadio from '@/components/Field/FieldRadio'
import FieldCheckbox from '@/components/Field/FieldCheckbox'
import FieldCheckboxes from '@/components/Field/FieldCheckboxes'
import FieldDate from '@/components/Field/FieldDate'
import FieldDateTime from '@/components/Field/FieldDateTime'
import FieldAddress from '@/components/Field/FieldAddress'
import FieldProcessedText from '@/components/Field/FieldProcessedText'

const { webform } = useAppConfig().stirTheme

// Props from parent
const props = defineProps<{
  field: WebformFieldProps
  fieldName: string
  state: WebformState
}>()

// Map the field types to components
const componentMap: Record<string, Component> = {
  textfield: FieldInput,
  email: FieldInput,
  number: FieldInput,
  tel: FieldInput,
  textarea: FieldTextarea,
  select: FieldSelect,
  radio: FieldRadio,
  checkbox: FieldCheckbox,
  checkboxes: FieldCheckboxes,
  datetime: FieldDateTime,
  date: FieldDate,
  address: FieldAddress,
  processed_text: FieldProcessedText,
}

// Determine if floating labels should be used (configurable per field)
const useFloatingLabels = computed(
  () =>
    props.field['#floating_label'] !== undefined
      ? props.field['#floating_label'] // Per-field setting
      : webform.labels.floating, // Global default
)

// Dynamically resolve the component
const resolvedComponent = computed(
  () => componentMap[props.field['#type']] || null,
)

// Compute description and help content
const descriptionContent = computed(() =>
  cleanHTML(props.field['#description'] || ''),
)
const helpContent = computed(() => cleanHTML(props.field['#help'] || ''))

// Reactive visibility state
const isVisible = ref(true)

// Dynamically re-evaluate visibility when form state or field conditions change
watchEffect(() => {
  isVisible.value = evaluateVisibility(props.field['#states'], props.state)
})
</script>

<template>
  <UFormField
    v-if="isVisible"
    :label="
      field['#type'] !== 'checkbox' && !useFloatingLabels
        ? field['#title']
        : undefined
    "
    :name="fieldName"
    :required="!!field['#required']"
  >
    <div
      v-if="descriptionContent && field['#type'] !== 'checkbox'"
      :class="webform.description"
      v-html="descriptionContent"
    />

    <component
      :is="resolvedComponent"
      v-if="resolvedComponent"
      :field="field"
      :field-name="fieldName"
      :floating-label="useFloatingLabels"
      :state="state"
    />

    <div v-if="helpContent" :class="webform.help" v-html="helpContent" />
  </UFormField>
</template>
