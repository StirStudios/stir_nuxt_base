<script setup lang="ts">
import type { WebformFieldProps } from '~/types/formTypes'

defineProps<{
  field: WebformFieldProps
}>()
</script>

<template>
  <div class="prose" v-html="field['#text']" />
</template>
