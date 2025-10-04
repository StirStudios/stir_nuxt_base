<script setup lang="ts">
import type { IconPorps } from '~/types/UtilityTypes'

defineProps<{
  item: IconPorps
}>()
</script>

<template>
  <WrapAlign :align="item.align">
    <UIcon :class="[`size-${item.iconSize || 6}`]" :name="item.iconName" />
  </WrapAlign>
</template>
