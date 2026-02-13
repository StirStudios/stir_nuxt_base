<script setup lang="ts">
import type { WebformFieldProps } from '~/types'

defineProps<{
  field: WebformFieldProps
  fieldName: string
}>()
</script>

<template>
  <div :class="['prose', fieldName]" v-html="field['#text']" />
</template>
