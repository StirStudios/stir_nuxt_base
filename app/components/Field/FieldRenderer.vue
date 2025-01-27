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
function transformOptionsForSelect(
  options: Record<string, string>,
): Array<{ label: string; value: string }> {
  return Object.entries(options).map(([value, label]) => ({
    label,
    value,
  }))
}
</script>

<template>
  <!-- Handle section fields -->
  <div v-if="field['#type'] === 'section'" class="mb-6">
    <h4 class="mb-2 font-bold">{{ field['#title'] }}</h4>
    <div class="space-y-4">
      <template
        v-for="(subField, subFieldName) in field.fields"
        :key="subFieldName"
      >
        <FieldRenderer
          :field="subField"
          :fieldName="subFieldName"
          :state="state"
        />
      </template>
    </div>
  </div>

  <!-- Handle individual fields -->
  <UFormField
    v-else
    :name="field['#name'] || fieldName"
    :required="field['#required']"
    class="mb-4"
    :title="field['#title']"
  >
    <!-- Description -->
    <template v-if="field['#description']" #description>
      <span v-html="field['#description']" />
    </template>

    <!-- Input -->
    <UInput
      v-if="['textfield', 'email'].includes(field['#type'])"
      v-model="state[field['#name']]"
      :type="field['#type']"
      :placeholder="field['#title']"
      class="w-full"
    />

    <!-- Textarea -->
    <UTextarea
      v-else-if="field['#type'] === 'textarea'"
      v-model="state[field['#name']]"
      :placeholder="field['#title']"
      class="w-full"
    />

    <!-- Select -->
    <USelect
      v-else-if="field['#type'] === 'select'"
      v-model="state[field['#name']]"
      :items="transformOptionsForSelect(field['#options'])"
      class="w-48"
      placeholder="Select status"
    />

    <!-- Radio Group -->
    <URadioGroup
      v-else-if="field['#type'] === 'radio'"
      v-model="state[field['#name']]"
      :items="transformOptionsForSelect(field['#options'])"
      :orientation="
        field['#optionsDisplay'] === 'side_by_side' ? 'horizontal' : 'vertical'
      "
      :legend="field['#title']"
    />

    <!-- Help -->
    <template v-if="field['#help']" #help>
      {{ field['#help'] }}
    </template>
  </UFormField>
</template>
