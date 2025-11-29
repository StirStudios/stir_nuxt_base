<script setup lang="ts">
defineProps<{
  content?: string
}>()

defineSlots<{
  default(): unknown
}>()
</script>

<template>
  <slot />
  <div v-if="content" v-html="content" />
</template>
