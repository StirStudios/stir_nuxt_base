<script setup lang="ts">
defineProps<{
  /* Core identifiers */
  id?: number
  uid?: number
  uuid?: string
  parentUuid?: string
  region?: string

  /* Display */
  maxItems?: number
  gridItems?: string
  randomize?: boolean
  editLink?: string
}>()

defineSlots<{
  media?: () => VNode[] | VNode | null
}>()
</script>

<template>
  <WrapGrid :classes="gridItems">
    <slot name="media" />
  </WrapGrid>
</template>
