<script setup lang="ts">
const props = defineProps<{
  field: Record<string, unknown>
  fieldName: string
  state: Record<string, Record<string, string>>
}>()

// Ensure composite fields exist before accessing
const compositeFields = computed(() => {
  return typeof props.field?.['#composite'] === 'object'
    ? props.field['#composite']
    : {}
})

// Ensure country options exist before accessing
const countryOptions = computed(() => {
  return compositeFields.value.country?.options
    ? Object.entries(compositeFields.value.country.options).map(
        ([key, label]) => ({ value: key, label }),
      )
    : []
})

// Ensure state[fieldName] is initialized before access
if (!props.state[props.fieldName]) {
  props.state[props.fieldName] = {}
}
</script>

<template>
  <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
    <UFormField
      v-for="(fieldData, key) in compositeFields"
      :key="key"
      :label="fieldData.label"
      :name="`${fieldName}.${key}`"
      :required="!!field['#required']"
    >
      <UInput
        v-if="key !== 'country'"
        v-model="state[fieldName][key]"
        class="form-input w-full"
      />

      <USelectMenu
        v-else
        v-model="state[fieldName].country"
        class="w-full"
        :items="countryOptions"
        label-key="label"
        placeholder="Select Country"
        value-key="label"
      />
    </UFormField>
  </div>
</template>
