<script setup lang="ts">
defineOptions({ inheritAttrs: false })

defineProps<{
  id?: number
  uid?: number
  uuid?: string
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
