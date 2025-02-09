<script setup lang="ts">
import type { WebformFieldProps } from '~/types/formTypes'

const props = defineProps<{
  field: WebformFieldProps
  fieldName: string
  state: Record<string, string | number>
}>()
</script>

<template>
  <UTextarea
    v-model="state[fieldName]"
    :placeholder="field['#placeholder'] || ''"
    class="w-full"
  />
</template>
