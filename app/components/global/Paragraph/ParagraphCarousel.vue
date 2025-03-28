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
const edttLink = computed(() => props.editLink || false)
</script>

<template>
  <EditLink :link="edttLink">
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
          <MediaSimple :media="[item]" v-if="item.type === 'image'" />
          <MediaPopup :media="[item]" v-else-if="item.type === 'video'" />
        </template>
      </UCarousel>
    </div>
  </EditLink>
</template>
