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
  const element =
    blockData.value?.content?.element ?? blockData.value?.element ?? ''
  return componentExists(element) ? element : 'ParagraphDefault'
})

// Extract data based on element type
const itemData = computed(() => {
  if (!blockData.value) return {}

  switch (blockData.value.element) {
    case 'paragraph-carousel':
      return {
        items: Array.isArray(blockData.value.media)
          ? blockData.value.media
          : [],
        carouselArrows: blockData.value.carouselArrows ?? false,
        carouselAutoscroll: blockData.value.carouselAutoscroll ?? false,
        carouselFade: blockData.value.carouselFade ?? false,
        carouselIndicators: blockData.value.carouselIndicators ?? false,
        carouselInterval: blockData.value.carouselInterval ?? 5000,
        gridItems: blockData.value.gridItems ?? '',
        width: blockData.value.width ?? 'w-full',
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
        animate: blockData.value.animate,
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
    v-if="blockData"
    :is="resolvedComponent"
    v-bind="{ item: itemData }"
  />
  <p v-else class="text-center text-gray-500">No content available.</p>
</template>
