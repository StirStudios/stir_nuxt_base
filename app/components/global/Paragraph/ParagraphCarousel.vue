<script setup lang="ts">
import type { ViewItemProps } from '~/types/ViewTypes'
import { componentExists } from '~/utils/componentExists'

const props = defineProps<{ item: ViewItemProps }>()

const {
  carouselArrows,
  carouselAutoscroll,
  carouselFade,
  carouselIndicators,
  carouselInterval,
  gridItems,
  content,
} = props.item

const items = computed(() => content?.rows || [])

const config = useAppConfig().stirTheme.carousel
</script>

<template>
  <div :class="[config.padding, 'relative z-10']">
    <UCarousel
      v-slot="{ item: row }"
      :arrows="carouselArrows"
      :auto-scroll="carouselAutoscroll"
      :autoplay="{ delay: carouselInterval || 5000 }"
      :dots="carouselIndicators"
      :fade="carouselFade"
      :items="items"
      loop
      :next="config.arrows.next"
      :next-icon="config.arrows.nextIcon"
      :prev="config.arrows.prev"
      :prev-icon="config.arrows.prevIcon"
      :ui="{ root: config.root, item: gridItems }"
    >
      <component
        :is="
          componentExists(row.element)
            ? resolveComponent(row.element)
            : 'ParagraphDefault'
        "
        :item="row"
      />
    </UCarousel>
  </div>
</template>
