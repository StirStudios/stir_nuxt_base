<script setup lang="ts">
import type { CarouselProps } from '~/types/MediaTypes'
import { componentExists } from '~/utils/componentExists'

const props = defineProps<CarouselProps>()

const appConfig = useAppConfig()
const showIndicators = computed(() => props.indicators || false)
const showArrows = computed(() => props.arrows || false)
const transitionFade = computed(() => props.fade || false)
const autoscroll = computed(() => props.autoscroll || false)
const interval = computed(() => props.interval || 5000)
const itemElement = computed(() => props.itemElement || false)
</script>

<template>
  <div :class="`relative z-10 ${appConfig.stirTheme.carousel.padding}`">
    <h2 v-if="header" class="mb-5">{{ header }}</h2>
    <UCarousel
      v-slot="{ item }"
      :arrows="showArrows"
      :auto-scroll="autoscroll"
      :autoplay="{ delay: interval }"
      :dots="showIndicators"
      :fade="transitionFade"
      :items="items"
      loop
      :next="appConfig.stirTheme.carousel.arrows.next"
      :next-icon="appConfig.stirTheme.carousel.arrows.nextIcon"
      :prev="appConfig.stirTheme.carousel.arrows.prev"
      :prev-icon="appConfig.stirTheme.carousel.arrows.prevIcon"
      :ui="{
        root: `${appConfig.stirTheme.carousel.root}`,
        item: amount,
      }"
    >
      <template v-if="itemElement">
        <component
          :is="
            componentExists(itemElement)
              ? resolveComponent(itemElement)
              : 'ParagraphDefault'
          "
          :item="item"
        />
      </template>
      <template v-else>
        <MediaSimple v-if="item.type === 'image'" :media="[item]" />
        <MediaPopup v-else-if="item.type === 'video'" :media="[item]" />
      </template>
    </UCarousel>
  </div>
</template>
