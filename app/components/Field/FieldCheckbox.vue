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
  <UCheckbox v-model="state[fieldName]" :label="fieldName" class="w-full" />
</template>
