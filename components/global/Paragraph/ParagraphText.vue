<script setup lang="ts">
import type { RegionItem } from '../types'

defineProps<{
  item: RegionItem
}>()
</script>

<template>
  <WrapAnimate
    :aos="item?.direction"
    :wrapper="item?.animate === true ? 'div' : undefined"
  >
    <div
      :class="[
        item.classes ? item.classes : 'content',
        item.width,
        item.spacing,
      ]"
      v-html="item.text"
    />
  </WrapAnimate>
</template>
