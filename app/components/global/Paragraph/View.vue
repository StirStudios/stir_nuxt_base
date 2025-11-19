<script setup lang="ts">
defineProps<{
  id?: number
  uuid?: string
  parentUuid?: string
  region?: string

  // layout
  header?: string
  gridItems?: string
  randomize?: boolean
  editLink?: string

  // NEW – fixes your warning
  direction?: string

  // view-specific props
  viewId?: string
  displayId?: string
  view?: any

  // carousel props
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
