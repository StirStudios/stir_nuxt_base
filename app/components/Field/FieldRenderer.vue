<script setup lang="ts">
import type { WebformFieldProps } from '~/types/formTypes'
import { sanitizeHTML } from '~/utils/sanitizeHTML'

// Import the field components locally
import FieldInput from '@/components/Field/FieldInput.vue'
import FieldTextarea from '@/components/Field/FieldTextarea.vue'
import FieldSelect from '@/components/Field/FieldSelect.vue'
import FieldRadio from '@/components/Field/FieldRadio.vue'
import FieldDate from '@/components/Field/FieldDate.vue'
import FieldProcessedText from '@/components/Field/FieldProcessedText.vue'

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
