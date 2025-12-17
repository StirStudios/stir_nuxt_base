<script setup lang="ts">
defineProps<{
  type: 'link'
  href: string
  title?: string
  target?: string
}>()
</script>

<template>
  <UButton
    color="primary"
    external
    :label="title || 'Listen'"
    :target="target || '_blank'"
    :to="href"
    variant="solid"
  />
</template>
