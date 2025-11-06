<script setup lang="ts">
defineProps<{ title?: string }>()
defineSlots<{ hero?(): unkown; section?(): unkown }>()
</script>

<template>
  <slot name="hero" />
  <slot name="section" />
</template>
