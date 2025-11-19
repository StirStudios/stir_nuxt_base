<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
})

defineProps<{ title?: string }>()
defineSlots<{
  hero?(): unkown
  section?(): unkown
}>()
</script>

<template>
  <slot name="hero" />
  <slot name="section" />
</template>
