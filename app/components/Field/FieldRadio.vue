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
  <URadioGroup
    v-model="state[fieldName]"
    :items="transformOptions(field['#options'] || {})"
    orientation="horizontal"
    class="w-full"
  />
</template>
