<script setup lang="ts">
const props = defineProps({
  field: Object,
  fieldName: String,
  state: Object,
})

/**
 * Transforms options for use in URadioGroup or USelect.
 * @param options - Object of key-value pairs.
 * @returns An array of objects with `label` and `value` keys.
 */
function transformOptionsForSelect(options: Record<string, string>) {
  return Object.entries(options).map(([value, label]) => ({ label, value }))
}
</script>

<template>
  <div v-if="field['#type'] === 'section'" class="mb-6">
    <h4 class="mb-2 font-bold">{{ field['#title'] }}</h4>
    <div class="space-y-4">
      <FieldRenderer
        v-for="(subField, subFieldName) in field.fields"
        :key="subFieldName"
        :field="subField"
        :fieldName="subFieldName"
        :state="state"
      />
    </div>
  </div>

  <UFormField
    :name="field['#name'] || fieldName"
    :label="field['#title'] || fieldName"
    :required="!!field['#required']"
    as="div"
    class="mb-4"
  >
    <template v-if="field['#description']" #description>
      <span v-html="field['#description']" />
    </template>

    <URadioGroup
      v-if="field['#type'] === 'radio'"
      v-model="state[fieldName]"
      :items="transformOptionsForSelect(field['#options'])"
      orientation="horizontal"
    />

    <UInput
      v-else-if="['textfield', 'email'].includes(field['#type'])"
      v-model="state[fieldName]"
      :type="field['#type']"
      :placeholder="field['#title']"
      class="w-full"
    />

    <UTextarea
      v-else-if="field['#type'] === 'textarea'"
      v-model="state[fieldName]"
      :placeholder="field['#title']"
      class="w-full"
    />

    <USelect
      v-else-if="field['#type'] === 'select'"
      v-model="state[fieldName]"
      :items="transformOptionsForSelect(field['#options'])"
      class="w-full"
    />

    <template v-if="field['#help']" #help>
      {{ field['#help'] }}
    </template>
  </UFormField>
</template>
