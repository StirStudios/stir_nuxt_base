<script setup lang="ts">
defineProps<{
  // Base identifiers
  id?: number | string
  uuid?: string
  parentUuid?: string
  region?: string

  // Basic display
  header?: string
  gridItems?: string
  randomize?: boolean
  width?: string
  editLink?: string
  direction?: string

  // Views
  viewId?: string
  displayId?: string
  view?: unknown

  // Carousel options
  carousel?: boolean
  carouselArrows?: boolean
  carouselAutoheight?: boolean
  carouselAutoscroll?: boolean
  carouselFade?: boolean
  carouselIndicators?: boolean
  carouselInterval?: number
}>()
</script>

<template>
  <slot name="content" />
</template>
