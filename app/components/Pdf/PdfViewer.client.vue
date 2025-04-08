<script setup lang="ts">
import { VPdfViewer, VPVBaseProps } from '@vue-pdf-viewer/viewer'

const props = defineProps({ ...VPVBaseProps })
</script>

<template>
  <ClientOnly>
    <VPdfViewer v-bind="props" />
  </ClientOnly>
</template>

<style scoped>
:deep(.vpv-variables) {
  --vpv-container-width-sm: 640px;
}
</style>
