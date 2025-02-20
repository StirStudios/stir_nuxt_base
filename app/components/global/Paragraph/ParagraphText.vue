<script setup lang="ts">
import type { RegionItemProps } from '~/types/ContentTypes'

defineProps<{
  item: RegionItemProps
}>()

const classes = (item.classes ? `${item.classes} prose` : 'content').trim()
</script>

<template>
  <WrapNone :wrapper="item.editLink ? 'div' : undefined">
    <EditLink :link="item.editLink" />
    <WrapAnimate
      :aos="item?.direction"
      :wrapper="item?.animate === true ? 'div' : undefined"
    >
      <div :class="[classes, item.width, item.spacing]" v-html="item.text" />
    </WrapAnimate>
  </WrapNone>
</template>
