<script setup lang="ts">
defineProps<{
  title?: string
  type?: string
  created?: number | string
}>()

defineSlots<{
  paragraphBlock?: () => unknown
}>()
</script>

<template>
  <slot name="paragraphBlock" />
</template>
