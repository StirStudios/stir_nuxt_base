<script setup lang="ts">
defineProps<{
  // Identity
  id?: number | string
  uuid?: string
  parentUuid?: string
  region?: string

  // Meta
  editLink?: string
}>()
</script>

<template>
  <EditLink :link="editLink">
    <slot />
  </EditLink>
</template>
