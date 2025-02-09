<script setup lang="ts">
import type { WebformFieldProps } from '~/types/formTypes'

const props = defineProps<{
  field: WebformFieldProps
  fieldName: string
  state: Record<string, string | number>
}>()
</script>

<template>
  <UInput v-model="state[fieldName]" class="w-full" />
</template>
