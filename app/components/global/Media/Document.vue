<script setup lang="ts">
defineProps<{
  type?: string
  mid?: string | number
  title?: string
  url?: string
}>()
</script>

<template>
  <PdfViewer v-if="url" :src="url" />
</template>
