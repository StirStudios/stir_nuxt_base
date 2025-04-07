<script setup lang="ts">
import type { WebformFieldProps } from '~/types/formTypes'
import { transformOptions } from '~/utils/transformOptions'

const props = defineProps<{
  field?: WebformFieldProps
  fieldName: string
  state: Record<string, string>
  items?: Record<string, string>
  placeholder?: string
}>()

onMounted(() => {
  if (props.state[props.fieldName] === undefined) {
    props.state[props.fieldName] = ''
  }
})

const selectItems = computed(() => {
  if (Array.isArray(props.items)) return props.items
  if (props.items && typeof props.items === 'object') {
    return transformOptions(props.items)
  }
  if (props.field) return transformOptions(props.field['#options'] || {})
  return []
})
</script>

<template>
  <USelect
    v-model="state[fieldName]"
    class="w-full"
    :items="selectItems"
    :placeholder="placeholder || 'Select'"
  />
</template>
