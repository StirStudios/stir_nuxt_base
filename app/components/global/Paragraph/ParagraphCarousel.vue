<script setup lang="ts">
import type { CarouselProps } from '~/types/MediaTypes'
import { componentExists, resolveComponentName } from '~/utils/componentExists'
import { useShuffledOrder } from '~/composables/useShuffledOrder'

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
const overlay = computed(() => props.overlay === true)

const shuffledItems = useShuffledOrder(props.items || [], props.randomize)
const showCarousel = computed(
  () => mounted.value && shuffledItems.value.length > 0,
)

const autoScrollSpeed = computed(() => {
  const minInterval = 1000
  const maxInterval = 10000
  const minSpeed = 1 // slowest (for 10s)
  const maxSpeed = 10 // fastest (for 1s)

  const clamped = Math.max(minInterval, Math.min(interval.value, maxInterval))
  const ratio = (maxInterval - clamped) / (maxInterval - minInterval)
  const speed = minSpeed + ratio * (maxSpeed - minSpeed)

  return +speed.toFixed(2)
})

const autoScrollOptions = computed(() =>
  autoscroll.value
    ? {
        stopOnMouseEnter: true,
        stopOnInteraction: false,
        speed: autoScrollSpeed.value,
      }
    : false,
)

const autoplayOptions = computed(() =>
  !autoscroll.value ? { delay: interval.value } : false,
)
</script>

<template>
  <div :class="`relative z-10 ${appConfig.stirTheme.carousel.padding}`">
    <UCarousel
      v-if="showCarousel"
      ref="carousel"
      v-slot="{ item }"
      :arrows="showArrows"
      :auto-scroll="autoScrollOptions"
      :autoplay="autoplayOptions"
      :dots="showIndicators"
      :fade="transitionFade"
      :items="shuffledItems"
      loop
      :next="appConfig.stirTheme.carousel.arrows.next"
      :next-icon="appConfig.stirTheme.carousel.arrows.nextIcon"
      :prev="appConfig.stirTheme.carousel.arrows.prev"
      :prev-icon="appConfig.stirTheme.carousel.arrows.prevIcon"
      :ui="{
        root: appConfig.stirTheme.carousel.root,
        item: amount,
        container: 'items-center',
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
        <MediaSimple v-if="item.type === 'image' && !overlay" :media="[item]" />
        <MediaPopup
          v-else-if="
            item.type === 'video' || (item.type === 'image' && overlay)
          "
          :media="[item]"
        />
      </template>
    </UCarousel>
  </div>
</template>
