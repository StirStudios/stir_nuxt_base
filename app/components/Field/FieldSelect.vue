<script setup lang="ts">
import type { WebformFieldProps } from '~/types/formTypes'
import { transformOptions } from '~/utils/transformOptions'

const props = defineProps<{
  field: WebformFieldProps
  fieldName: string
  state: Record<string, string | number>
}>()
</script>

<template>
  <USelect
    v-model="state[fieldName]"
    placeholder="Select"
    :items="transformOptions(field['#options'] || {})"
    class="w-full"
  />
</template>
