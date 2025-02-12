<script setup lang="ts">
import type { WebformFieldProps } from '~/types/formTypes'
import { transformOptions } from '~/utils/transformOptions'

const props = defineProps<{
  field: WebformFieldProps
  fieldName: string
  state: Record<string, any>
}>()

// Transform options dynamically
const transformedOptions = computed(() =>
  transformOptions(props.field['#options'] || {}),
)

onMounted(() => {
  if (props.state[props.fieldName] === undefined) {
    // Ensure default values map correctly to transformed options
    const defaultValue = props.field['#default'] ?? ''
    const matchingOption = transformedOptions.value.find(
      (opt) => opt.value === defaultValue,
    )
    props.state[props.fieldName] = matchingOption ? matchingOption.value : ''
  }
})
</script>

<template>
  <URadioGroup
    v-model="state[fieldName]"
    :items="transformedOptions"
    orientation="horizontal"
    class="w-full"
  >
    <template #label="{ item }">
      <div v-if="item.label" v-html="item.label" />
    </template>
  </URadioGroup>
</template>
