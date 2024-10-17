<script setup lang="ts">
defineProps<{
  content: string
}>()
</script>

<template>
  <div
    :class="content.element === 'node' ? '' : 'p-10 text-center'"
    v-html="content"
  />
</template>
