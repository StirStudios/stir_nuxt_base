<script setup lang="ts">
import type { CarouselProps } from '~/types/MediaTypes'
import { componentExists, resolveComponentName } from '~/utils/componentExists'

const props = defineProps<CarouselProps>()

const mounted = ref(false)
const carousel = useTemplateRef('carousel')

onMounted(() => {
  mounted.value = true
})

const appConfig = useAppConfig()

const showIndicators = computed(() => props.indicators || false)
const showArrows = computed(() => props.arrows || false)
const transitionFade = computed(() => props.fade || false)
const autoscroll = computed(() => props.autoscroll || false)
const interval = computed(() => props.interval || 5000)
const itemElement = computed(() => props.itemElement || false)

const autoScrollSpeed = computed(() => {
  const clamped = Math.max(1000, Math.min(interval.value, 10000))
  return Math.round(10_000 / clamped)
})

const basePauseOptions = {
  stopOnMouseEnter: true,
  stopOnInteraction: false,
}

const autoScrollOptions = computed(() =>
  autoscroll.value
    ? { ...basePauseOptions, speed: autoScrollSpeed.value }
    : false,
)

const autoplayOptions = computed(() =>
  !autoscroll.value ? { ...basePauseOptions } : false,
)

const showCarousel = computed(() => mounted.value && props.items?.length > 0)
</script>

<template>
  <div :class="`relative z-10 ${appConfig.stirTheme.carousel.padding}`">
    <h2 v-if="header" class="mb-5">{{ header }}</h2>
    <UCarousel
      v-if="showCarousel"
      ref="carousel"
      v-slot="{ item }"
      :arrows="showArrows"
      :auto-scroll="autoScrollOptions"
      :autoplay="autoplayOptions"
      :dots="showIndicators"
      :fade="transitionFade"
      :items="items"
      loop
      :next="appConfig.stirTheme.carousel.arrows.next"
      :next-icon="appConfig.stirTheme.carousel.arrows.nextIcon"
      :prev="appConfig.stirTheme.carousel.arrows.prev"
      :prev-icon="appConfig.stirTheme.carousel.arrows.prevIcon"
      :ui="{
        root: appConfig.stirTheme.carousel.root,
        item: amount,
      }"
    >
      <template v-if="itemElement">
        <component
          :is="
            componentExists(itemElement)
              ? resolveComponentName(itemElement)
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
