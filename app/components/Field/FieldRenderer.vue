<script setup lang="ts">
const props = defineProps({
  field: {
    type: Object,
    required: true,
  },
  fieldName: {
    type: String,
    required: true,
  },
  state: {
    type: Object,
    required: true,
  },
  prefix: {
    type: String,
    default: '',
  },
})

// Get the form field path
const getFieldPath = () =>
  props.prefix ? `${props.prefix}.${props.fieldName}` : props.fieldName

// Transform options for radio/select fields
function transformOptions(options: Record<string, string>) {
  return Object.entries(options).map(([value, label]) => ({ label, value }))
}
</script>

<template>
  <UFormField
    :name="getFieldPath()"
    :label="field['#title']"
    :required="!!field['#required']"
  >
    <template v-if="field['#description']" #description>
      <span v-html="field['#description']" />
    </template>

    <URadioGroup
      v-if="field['#type'] === 'radio'"
      v-model="state[getFieldPath()]"
      :items="transformOptions(field['#options'] || {})"
      orientation="horizontal"
    />

    <UInput
      v-else-if="['textfield', 'email'].includes(field['#type'])"
      v-model="state[getFieldPath()]"
      :type="field['#type']"
      class="w-full"
    />

    <UTextarea
      v-else-if="field['#type'] === 'textarea'"
      v-model="state[getFieldPath()]"
      class="w-full"
    />

    <USelect
      v-else-if="field['#type'] === 'select'"
      v-model="state[getFieldPath()]"
      :items="transformOptions(field['#options'] || {})"
      class="w-full"
    />

    <template v-if="field['#help']" #help>
      {{ field['#help'] }}
    </template>
  </UFormField>
</template>
