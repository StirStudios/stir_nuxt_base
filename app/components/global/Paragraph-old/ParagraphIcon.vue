<script setup lang="ts">
defineProps<{
  item: {
    align: string
    iconName: string
    iconSize?: string
  }
}>()
</script>

<template>
  <WrapAlign :align="item.align">
    <UIcon :class="[`size-${item.iconSize || 6}`]" :name="item.iconName" />
  </WrapAlign>
</template>
