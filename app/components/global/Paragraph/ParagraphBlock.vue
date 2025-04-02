<script setup lang="ts">
import type { ParagraphBlockProps } from '~/types/ContentTypes'
import { componentExists } from '~/utils/componentExists'

const props = defineProps<ParagraphBlockProps>()

// Extract block data safely
const blockData = computed(() => {
  return props.blocks?.decoupled?.[props.blockName]?.paragraphBlock?.[0] ?? null
})

// Determine the correct component to render
const resolvedComponent = computed(() => {
  if (!blockData.value) return null
  const element = blockData.value.element ?? ''
  return componentExists(element) ? element : 'ParagraphDefault'
})

// Extract data based on element type
const itemData = computed(() => {
  if (!blockData.value) return null

  switch (blockData.value.element) {
    case 'paragraph-carousel':
      return {
        item: blockData.value,
        amount: blockData.value.gridItems,
        header: blockData.value.header,
        indicators: blockData.value.carouselIndicators,
        arrows: blockData.value.carouselArrows,
        fade: blockData.value.carouselFade,
        autoscroll: blockData.value.carouselAutoscroll,
        interval: blockData.value.carouselInterval,
        items: blockData.value.media,
        width: blockData.value.width,
      }

    case 'paragraph-view':
      return {
        ...blockData.value.content,
        carousel: blockData.value.carousel,
        carouselIndicators: blockData.value.carouselIndicators,
        carouselArrows: blockData.value.carouselArrows,
        carouselFade: blockData.value.carouselFade,
        carouselAutoscroll: blockData.value.carouselAutoscroll,
        carouselInterval: blockData.value.carouselInterval,
        spacing: blockData.value.spacing,
        width: blockData.value.width,
        gridItems: blockData.value.gridItems,
        direction: blockData.value.direction,
      }

    case 'paragraph-webform':
      return {
        webform: blockData.value.webform,
      }

    default:
      return blockData.value
  }
})
</script>

<template>
  <component
    :is="resolvedComponent"
    v-if="blockData && resolvedComponent"
    v-bind="{ item: itemData }"
  />
</template>
