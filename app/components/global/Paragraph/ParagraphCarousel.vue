<script setup lang="ts">
import type { CarouselProps } from '~/types/MediaTypes'

const props = defineProps<CarouselProps>()

const appConfig = useAppConfig()
const showIndicators = computed(() => props.indicators || false)
const showArrows = computed(() => props.arrows || false)
const transitionFade = computed(() => props.fade || false)
const autoscroll = computed(() => props.autoscroll || false)
const interval = computed(() => props.interval || 5000)

// Dynamically calculate grid classes based on the amount of items
const itemGrid = computed(() => {
  const amount = props.amount || 1
  const lgBasis = `lg:basis-1/${amount}` // Set lg basis based on amount
  const mdBasis = amount > 1 ? `md:basis-1/${Math.ceil(amount / 2)}` : '' // Set md basis conditionally

  // Handle sm basis customization using appConfig, default to 'basis-auto'
  const smBasis = appConfig.stirTheme.grid.smBasis
    ? `sm:basis-1/${appConfig.stirTheme.grid.smBasis}`
    : 'sm:basis-auto' // Default for small screens

  return `${smBasis} ${mdBasis} ${lgBasis}`.trim() // Return combined classes
})
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
        item: itemGrid,
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
