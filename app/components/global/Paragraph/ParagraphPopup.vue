<script setup lang="ts">
interface ParagraphPopupItem {
  text?: string
  webform?: Record<string, unknown>
}

defineProps<{
  item: ParagraphPopupItem
  onClose?: () => void
}>()
</script>

<template>
  <ParagraphMedia :item="item" />
  <div class="p-5">
    <div v-html="item.text" />
    <ParagraphWebform :item="{ webform: item.webform }" :on-close="onClose" />
  </div>
</template>
