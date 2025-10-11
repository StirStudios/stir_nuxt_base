<script setup lang="ts">
import type { CarouselProps } from '~/types'
import { componentExists, resolveComponentName } from '~/utils/componentExists'
import { useShuffledOrder } from '~/composables/useShuffledOrder'

const props = defineProps<{ item: CarouselProps }>()
const item = computed(() => props.item || {})

const mounted = ref(false)
const carousel = useTemplateRef('carousel')
const appConfig = useAppConfig()
const { carousel: carouselConfig = {} } = appConfig.stirTheme

onMounted(() => {
  mounted.value = true
})

const showIndicators = computed(() => item.value.carouselIndicators || false)
const showArrows = computed(() => item.value.carouselArrows || false)
const transitionFade = computed(() => item.value.carouselFade || false)
const autoscroll = computed(() => item.value.carouselAutoscroll || false)
const autoHeight = computed(() => item.value.carouselAutoheight || false)
const interval = computed(() => item.value.carouselInterval || 5000)
const itemElement = computed(() => item.value.itemElement || false)
const overlay = computed(() => item.value.overlay === true)
const amount = computed(() => item.value.gridItems || 'basis-full')

const shuffledItems = useShuffledOrder(
  item.value.items ?? item.value.media ?? [],
  item.value.randomize ?? false,
)

const showCarousel = computed(
  () => mounted.value && shuffledItems.value.length > 0,
)

const defaultArrow = {
  prev: { label: 'Previous' },
  next: { label: 'Next' },
  prevIcon: 'i-heroicons-arrow-left',
  nextIcon: 'i-heroicons-arrow-right',
}

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

function handleSelect() {
  const plugins = carousel.value?.emblaApi?.plugins?.()
  plugins?.autoplay?.reset?.()
  plugins?.autoScroll?.reset?.()
}
</script>

<template>
  <div :class="`relative z-10 ${carouselConfig.padding}`">
    <UCarousel
      v-if="showCarousel"
      ref="carousel"
      v-slot="{ item }"
      :arrows="showArrows"
      :auto-height="autoHeight"
      :auto-scroll="autoScrollOptions"
      :autoplay="autoplayOptions"
      :dots="showIndicators"
      :fade="transitionFade"
      :items="shuffledItems"
      loop
      :next="carouselConfig.arrows?.next ?? defaultArrow.next"
      :next-icon="carouselConfig.arrows?.nextIcon ?? defaultArrow.nextIcon"
      :prev="carouselConfig.arrows?.prev ?? defaultArrow.prev"
      :prev-icon="carouselConfig.arrows?.prevIcon ?? defaultArrow.prevIcon"
      :ui="{
        root: carouselConfig.root,
        item: amount,
        container: 'items-center transition-[height]',
      }"
      @select="handleSelect"
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
        <!-- Paragraph-style content (e.g., node-review) -->
        <component
          :is="
            componentExists(item.element)
              ? resolveComponentName(item.element)
              : 'ParagraphDefault'
          "
          v-if="item.element"
          :item="item"
        />

        <!-- Media fallback if no element key -->
        <MediaSimple
          v-else-if="item.type === 'image' && !overlay"
          :media="[item]"
        />
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
