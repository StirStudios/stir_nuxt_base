<script setup lang="ts">
defineSlots<{
  body()
  image()
}>()
defineProps<{
  title?: string
  type?: string
  created?: number | string
  // Layout-builder support.
  sections?: object
}>()
</script>

<template>
  <div class="node">
    <slot name="image">
      <component :is="useDrupalCe().renderCustomElements($attrs.image)" />
    </slot>
    <slot name="body">
      <component :is="useDrupalCe().renderCustomElements($attrs.body)" />
    </slot>
  </div>
</template>
