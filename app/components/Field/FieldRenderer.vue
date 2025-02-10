<script setup lang="ts">
import type { WebformFieldProps } from '~/types/formTypes'
import { sanitizeHTML } from '~/utils/sanitizeHTML'

// Import the field components locally
import FieldInput from '@/components/Field/FieldInput'
import FieldTextarea from '@/components/Field/FieldTextarea'
import FieldSelect from '@/components/Field/FieldSelect'
import FieldRadio from '@/components/Field/FieldRadio'
import FieldCheckbox from '@/components/Field/FieldCheckbox'
import FieldDate from '@/components/Field/FieldDate'
import FieldProcessedText from '@/components/Field/FieldProcessedText'

const props = defineProps<{
  field: WebformFieldProps
  fieldName: string
  state: Record<string, any>
}>()

// Map the field types to the correct component
const componentMap = {
  textfield: FieldInput,
  email: FieldInput,
  textarea: FieldTextarea,
  select: FieldSelect,
  radio: FieldRadio,
  checkbox: FieldCheckbox,
  date: FieldDate,
  processed_text: FieldProcessedText,
}

// Dynamically resolve the component or skip rendering if unknown
const resolvedComponent = computed(
  () => componentMap[props.field['#type']] || null,
)

// Computed description and help content
const descriptionContent = computed(() => props.field['#description'] || '')
const helpContent = computed(() => props.field['#help'] || '')
</script>

<template>
  <UFormField
    :name="fieldName"
    :label="field['#title']"
    :required="!!field['#required']"
  >
    <template v-if="descriptionContent" #description>
      <span v-html="sanitizeHTML(descriptionContent)" />
    </template>

    <component
      v-if="resolvedComponent"
      :is="resolvedComponent"
      :field="field"
      :fieldName="fieldName"
      :state="state"
    />

    <template v-if="helpContent" #help>
      <span v-html="sanitizeHTML(helpContent)" />
    </template>
  </UFormField>
</template>
