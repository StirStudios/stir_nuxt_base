<script setup lang="ts">
import type { RegionItemProps } from '~/types/ContentTypes'

defineProps<{
  item: RegionItemProps
}>()
</script>

<template>
  <WrapNone :wrapper="item.editLink ? 'div' : undefined">
    <EditLink :link="item.editLink" />
    <WrapAnimate :effect="item?.direction" :animate="item?.animate">
      <div
        :class="[
          [item.classes, 'prose'].filter(Boolean).join(' '),
          item.width,
          item.spacing,
        ]"
        v-html="item.text"
      />
    </WrapAnimate>
  </WrapNone>
</template>
