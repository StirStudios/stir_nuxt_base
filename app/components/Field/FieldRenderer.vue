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
  errors: {
    type: Object,
    default: () => ({}),
  },
})

// Compute the field path using dot notation
const getFieldPath = () =>
  props.prefix ? `${props.prefix}.${props.fieldName}` : props.fieldName

// Access nested field values safely
function getFieldValue(path: string) {
  return path
    .split('.')
    .reduce(
      (acc, key) => (acc && acc[key] !== undefined ? acc[key] : ''),
      props.state,
    )
}

// Bind the v-model correctly using nested paths
function bindField(path: string, value: any) {
  const keys = path.split('.')
  let obj = props.state

  keys.slice(0, -1).forEach((key) => {
    if (!obj[key]) obj[key] = {}
    obj = obj[key]
  })

  obj[keys[keys.length - 1]] = value
}

// Transform options for select/radio fields
function transformOptions(options: Record<string, string>) {
  return Object.entries(options).map(([value, label]) => ({ label, value }))
}
</script>

<template>
  <template v-if="field['#type'] === 'webform_section'">
    <fieldset class="rounded-md border border-gray-300 p-4">
      <legend class="text-lg font-bold">{{ field['#title'] }}</legend>
      <template
        v-for="(nestedField, nestedFieldName) in field"
        :key="nestedFieldName"
      >
        <FieldRenderer
          v-if="nestedField['#type']"
          :field="nestedField"
          :fieldName="nestedFieldName"
          :state="state"
          :prefix="getFieldPath()"
          :errors="errors"
        />
      </template>
    </fieldset>
  </template>

  <UFormField
    v-else
    :name="getFieldPath()"
    :label="field['#title']"
    :required="!!field['#required']"
    :error="errors[getFieldPath()]"
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
      :model-value="getFieldValue(getFieldPath())"
      @update:model-value="bindField(getFieldPath(), $event)"
      :type="field['#type']"
      class="w-full"
    />

    <UTextarea
      v-else-if="field['#type'] === 'textarea'"
      :model-value="getFieldValue(getFieldPath())"
      @update:model-value="bindField(getFieldPath(), $event)"
      class="w-full"
    />

    <USelect
      v-else-if="field['#type'] === 'select'"
      :model-value="getFieldValue(getFieldPath())"
      @update:model-value="bindField(getFieldPath(), $event)"
      :items="transformOptions(field['#options'] || {})"
      class="w-full"
    />

    <template v-if="field['#help']" #help>
      <span v-html="field['#help']" />
    </template>
  </UFormField>
</template>
