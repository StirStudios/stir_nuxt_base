<script setup lang="ts">
import type { WebformFieldProps } from '~/types/formTypes'
import { cleanHTML } from '~/utils/cleanHTML'

const props = defineProps<{
  field: WebformFieldProps
  fieldName: string
  state: Record<string, any>
}>()

// Transform options to include labels and descriptions
const transformedOptions = computed(() => {
  return Object.entries(props.field['#options'] || {}).map(
    ([value, option]) => ({
      value,
      label: option.label,
      description: option.description ? cleanHTML(option.description) : '',
    }),
  )
})

onMounted(() => {
  if (props.state[props.fieldName] === undefined) {
    props.state[props.fieldName] = ''
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
    <template #description="{ item }">
      <div class="mt-2" v-if="item.description" v-html="item.description" />
    </template>
  </URadioGroup>
</template>
