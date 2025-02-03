<script setup lang="ts">
const props = defineProps<{
  type: string
  message: string
}>()
</script>

<template>
  <div :class="['message', type]">
    <div v-html="message" />
  </div>
</template>
