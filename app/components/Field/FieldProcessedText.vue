<script setup lang="ts">
import type { WebformFieldProps } from '~/types/formTypes'

const props = defineProps<{
  field: WebformFieldProps
}>()
</script>

<template>
  <div v-html="field['#text']" class="processed-text-content" />
</template>
