<script setup lang="ts">
import type { RegionItemProps } from '~/types'

defineProps<{
  item: RegionItemProps
}>()
</script>

<template>
  <EditLink :link="item.editLink">
    <WrapAnimate :effect="item?.direction">
      <WrapAlign :align="item.align">
        <div
          :class="[
            [item.classes, 'prose'].filter(Boolean).join(' '),
            item.width,
            item.spacing,
          ]"
          v-html="item.text"
        />
      </WrapAlign>
    </WrapAnimate>
  </EditLink>
</template>
