<script setup lang="ts">
import type { WebformFieldProps } from '~/types/formTypes'
import { transformOptions } from '~/utils/transformOptions'

const props = defineProps<{
  field: WebformFieldProps
  fieldName: string
  state: Record<string, any>
}>()

onMounted(() => {
  if (props.state[props.fieldName] === undefined) {
    props.state[props.fieldName] = ''
  }
})
</script>

<template>
  <USelect
    v-model="state[fieldName]"
    class="w-full"
    :items="transformOptions(field['#options'] || {})"
    placeholder="Select"
  />
</template>
