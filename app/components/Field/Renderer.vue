<script setup lang="ts">
import type { WebformFieldProps, WebformState } from '~/types'
import { useEvaluateState } from '~/composables/useEvaluateState'

import {
  FieldInput,
  FieldTextarea,
  FieldSelect,
  FieldRadio,
  FieldCheckbox,
  FieldCheckboxes,
  FieldDate,
  FieldDateTime,
  FieldAddress,
  FieldProcessedText,
} from '#components'

const props = withDefaults(
  defineProps<{
    field: WebformFieldProps
    fieldName: string
    state: WebformState
    fields?: Record<string, WebformFieldProps>
    orderedFieldNames?: string[]
    bypassRelocatedFilter?: boolean
  }>(),
  {
    fields: () => ({}),
    orderedFieldNames: () => [],
  },
)

const { webform } = useAppConfig().stirTheme

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

const shouldRender = computed(() => {
  return (
    props.bypassRelocatedFilter === true || props.field['#relocated'] !== true
  )
})

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
    v-else-if="visible && shouldRender"
    :disabled="!checked"
    :label="shouldShowLabel ? field['#title'] : undefined"
    :name="fieldName"
    :required="!!field['#required']"
    :ui="{ label: labelClass }"
  >
    <ButtonModal v-if="field['#modal'] === true" :modal-id="field['#name']" />

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
