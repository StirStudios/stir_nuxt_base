<script setup lang="ts">
import type { CarouselProps } from '~/types/MediaTypes'

const props = defineProps<CarouselProps>()

const appConfig = useAppConfig()
const interval = computed(() => props.interval || 5000)
</script>

<template>
  <div :class="`relative z-10 ${appConfig.stirTheme.carousel.padding}`">
    <h2 v-if="header" class="mb-5">{{ header }}</h2>
    <UCarousel
      v-slot="{ item }"
      loop
      :auto-scroll="autoscroll"
      :fade="transitionFade"
      :arrows="showArrows"
      :dots="showIndicators"
      :autoplay="{ delay: interval }"
      :items="items"
      :prev="appConfig.stirTheme.carousel.arrows.prev"
      :next="appConfig.stirTheme.carousel.arrows.next"
      :prev-icon="appConfig.stirTheme.carousel.arrows.prevIcon"
      :next-icon="appConfig.stirTheme.carousel.arrows.nextIcon"
      :ui="{
        root: `${appConfig.stirTheme.carousel.root}`,
        item: gridItems,
      }"
    >
      <template v-if="item.element">
        <template v-for="(sectionItem, index) in item.section" :key="index">
          <component
            :is="resolveComponent(sectionItem.element)"
            :item="sectionItem"
          />
        </template>
      </template>
      <template v-else>
        <MediaSimple :media="[item]" v-if="item.type === 'image'" />
        <MediaPopup :media="[item]" v-else-if="item.type === 'video'" />
      </template>
    </UCarousel>
  </div>
</template>
