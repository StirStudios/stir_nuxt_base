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
})

// Sanitize or convert HTML safely
function sanitizeHTML(html: string): string {
  return html.replace(/<\/?[^>]+(>|$)/g, '')
}

// Computed description and help content
const descriptionContent = computed(() => props.field['#description'] || '')
const helpContent = computed(() => props.field['#help'] || '')

// Transform options for select/radio fields
function transformOptions(options: Record<string, string>) {
  return Object.entries(options).map(([value, label]) => ({ label, value }))
}
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

    <URadioGroup
      v-if="field['#type'] === 'radio'"
      v-model="state[fieldName]"
      :items="transformOptions(field['#options'] || {})"
      orientation="horizontal"
    />

    <UInput
      v-else-if="['textfield', 'email'].includes(field['#type'])"
      v-model="state[fieldName]"
      :type="field['#type']"
      class="w-full"
    />

    <UTextarea
      v-else-if="field['#type'] === 'textarea'"
      v-model="state[fieldName]"
      class="w-full"
    />

    <USelect
      v-else-if="field['#type'] === 'select'"
      v-model="state[fieldName]"
      :items="transformOptions(field['#options'] || {})"
      class="w-full"
    />

    <template v-if="helpContent" #help>
      <span v-html="sanitizeHTML(helpContent)" />
    </template>
  </UFormField>
</template>
