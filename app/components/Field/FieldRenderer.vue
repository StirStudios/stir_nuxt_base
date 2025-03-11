<script setup lang="ts">
import type { WebformFieldProps } from '~/types/formTypes'
import { cleanHTML } from '~/utils/cleanHTML'
import { evaluateVisibility } from '~/utils/evaluateVisibility'

// Import field components locally
import FieldInput from '@/components/Field/FieldInput'
import FieldTextarea from '@/components/Field/FieldTextarea'
import FieldSelect from '@/components/Field/FieldSelect'
import FieldRadio from '@/components/Field/FieldRadio'
import FieldCheckbox from '@/components/Field/FieldCheckbox'
import FieldDate from '@/components/Field/FieldDate'
import FieldAddress from '@/components/Field/FieldAddress'
import FieldProcessedText from '@/components/Field/FieldProcessedText'

const appConfig = useAppConfig()

// Props from parent
const props = defineProps<{
  field: WebformFieldProps
  fieldName: string
  state: Record<string, any>
}>()

// Map the field types to components
const componentMap = {
  textfield: FieldInput,
  email: FieldInput,
  textarea: FieldTextarea,
  select: FieldSelect,
  radio: FieldRadio,
  checkbox: FieldCheckbox,
  date: FieldDate,
  address: FieldAddress,
  processed_text: FieldProcessedText,
}

// Determine if floating labels should be used (configurable per field)
const useFloatingLabels = computed(
  () =>
    props.field['#floating_label'] !== undefined
      ? props.field['#floating_label'] // Per-field setting
      : appConfig.stirTheme.webform.labelsFloating, // Global default
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
    :name="fieldName"
    :label="!useFloatingLabels ? field['#title'] : ''"
    :required="!!field['#required']"
  >
    <div
      v-if="descriptionContent && field['#type'] !== 'checkbox'"
      class="desc mb-3"
      v-html="descriptionContent"
    />

    <component
      v-if="resolvedComponent"
      :is="resolvedComponent"
      :field="field"
      :fieldName="fieldName"
      :floatingLabel="useFloatingLabels"
      :state="state"
    />

    <div
      v-if="helpContent"
      class="desc my-3 text-(--ui-text-muted)"
      v-html="helpContent"
    />
  </UFormField>
</template>
