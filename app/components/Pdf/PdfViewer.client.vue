<script setup lang="ts">
import { VPdfViewer, VPVBaseProps } from '@vue-pdf-viewer/viewer'

const props = defineProps({ ...VPVBaseProps })
</script>

<template>
  <div class="mx-auto h-full w-full pb-20">
    <ClientOnly>
      <VPdfViewer v-bind="props" />
    </ClientOnly>
  </div>
</template>

<style scoped>
:deep(.vpv-variables) {
  --vpv-container-width-sm: 640px;
}
</style>
