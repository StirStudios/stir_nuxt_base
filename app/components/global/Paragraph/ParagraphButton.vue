<script setup lang="ts">
import type { RegionItemProps } from '~/types/ContentTypes'

const props = defineProps<{
  item: RegionItemProps
}>()

const button = props.item.link?.[0] || null
</script>

<template>
  <div :class="['flex w-full', item.align, item.spacing, item.width]">
    <UButton
      v-if="button?.uri"
      :label="button.title || 'Learn More'"
      :to="button.uri"
      class="mt-4"
      target="_blank"
    />
  </div>
</template>
