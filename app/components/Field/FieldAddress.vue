<script setup lang="ts">
import type { WebformFieldProps } from '~/types/formTypes'

// Props from parent
const props = defineProps<{
  field: Record<string, any>
  fieldName: string
  state: Record<string, any>
}>()

// Extract composite field structure
const compositeFields = computed(() => props.field?.['#composite'] || {})

// Convert country options into `{ value, label }` format
const countryOptions = computed(() =>
  Object.entries(compositeFields.value.country?.options ?? {}).map(
    ([key, label]) => ({ value: key, label }),
  ),
)
</script>

<template>
  <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
    <UFormField
      v-for="(fieldData, key) in compositeFields"
      :key="key"
      :name="`${fieldName}.${key}`"
      :label="fieldData.label"
      :required="!!field['#required']"
    >
      <UInput
        v-if="key !== 'country'"
        v-model="state[fieldName][key]"
        class="w-full"
      />

      <USelectMenu
        v-else
        v-model="state[fieldName].country"
        placeholder="Select Country"
        :items="countryOptions"
        valueKey="label"
        labelKey="label"
        class="w-full"
      />
    </UFormField>
  </div>
</template>
