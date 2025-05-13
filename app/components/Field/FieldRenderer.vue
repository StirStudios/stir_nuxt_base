<script setup lang="ts">
import type { WebformFieldProps, WebformState } from '~/types/formTypes'
import { useEvaluateState } from '~/composables/useEvaluateState'

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

const props = defineProps<{
  field: WebformFieldProps
  fieldName: string
  state: WebformState
  fields: Record<string, WebformFieldProps>
  orderedFieldNames: string[]
}>()

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

const useFloatingLabels = computed(
  () => props.field['#floating_label'] ?? webform.labels.floating,
)

const resolvedComponent = computed(
  () => componentMap[props.field['#type']] || null,
)

const shouldShowLabel = computed(
  () =>
    props.field['#type'] !== 'checkbox' &&
    props.field['#type'] !== 'hidden' &&
    !useFloatingLabels.value,
)

const shouldShowDescription = computed(
  () =>
    props.field['#type'] !== 'checkbox' && props.field['#type'] !== 'hidden',
)

/**
 * Reactive evaluation using composable
 */
const { visible, checked } = useEvaluateState(
  props.field['#states'] ?? {},
  props.state,
)

const descriptionContent = props.field['#description'] || ''
const helpContent = props.field['#help'] || ''
const labelClass = computed(() => props.field['#class'] || '')
</script>

<template>
  <input
    v-if="field['#type'] === 'hidden'"
    :name="fieldName"
    type="hidden"
    :value="field['#defaultValue']"
  />

  <UFormField
    v-else-if="visible"
    :disabled="!checked"
    :label="shouldShowLabel ? field['#title'] : undefined"
    :name="fieldName"
    :required="!!field['#required']"
    :ui="{
      label: labelClass,
    }"
  >
    <ButtonVendor
      v-if="field['#group'] === 'vendor'"
      :vendor-id="field['#name']"
    />

    <div
      v-if="descriptionContent && shouldShowDescription"
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
