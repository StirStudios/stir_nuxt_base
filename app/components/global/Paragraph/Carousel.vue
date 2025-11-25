<script setup lang="ts">
const props = defineProps<{
  // Core content
  items?: unknown[]

  // Layout
  gridItems?: string

  // UI / Interaction
  carouselIndicators?: boolean
  carouselArrows?: boolean
  carouselFade?: boolean
  carouselAutoscroll?: boolean
  carouselAutoheight?: boolean
  carouselInterval?: number

  // Edit mode
  editLink?: string
}>()

const carousel = useTemplateRef<'carousel'>('carousel')
const theme = useAppConfig().stirTheme

const slots = useSlots()

const slides = computed(() => {
  // Items from views OR media slot
  const raw =
    (props.items && props.items.length) || (slots.media && slots.media().length)
      ? (props.items ?? slots.media())
      : []

  return raw.map((vnode, i) => ({
    vnode,
    key: vnode.key || i,
  }))
})

// Autoscroll speed
const interval = computed(() => props.carouselInterval || 5000)

const autoScrollSpeed = computed(() => {
  const minInterval = 1000
  const maxInterval = 10000
  const minSpeed = 1
  const maxSpeed = 10

  const clamped = Math.max(minInterval, Math.min(interval.value, maxInterval))
  const ratio = (maxInterval - clamped) / (maxInterval - minInterval)
  const speed = minSpeed + ratio * (maxSpeed - minSpeed)

  return +speed.toFixed(2)
})

const autoScrollOptions = computed(() =>
  props.carouselAutoscroll
    ? {
        speed: autoScrollSpeed.value,
        stopOnMouseEnter: true,
        stopOnInteraction: false,
      }
    : false,
)

const autoplayOptions = computed(() =>
  !props.carouselAutoscroll
    ? {
        delay: interval.value,
        stopOnMouseEnter: true,
        stopOnInteraction: false,
      }
    : false,
)

// Reset plugin timers on manual selection
function handleSelect() {
  const plugins = carousel.value?.emblaApi?.plugins?.()

  if (plugins?.autoplay && !props.carouselAutoscroll) plugins.autoplay.reset()

  if (plugins?.autoScroll && props.carouselAutoscroll)
    plugins.autoScroll.reset()
}
</script>

<template>
  <div class="relative z-10" :class="theme.carousel.padding">
    <UCarousel
      v-if="slides.length"
      ref="carousel"
      v-slot="{ item }"
      :arrows="carouselArrows"
      :auto-height="carouselAutoheight"
      :auto-scroll="autoScrollOptions"
      :autoplay="autoplayOptions"
      :dots="carouselIndicators"
      :fade="carouselFade"
      :items="slides"
      loop
      :next="theme.carousel.arrows?.next"
      :next-icon="theme.carousel.arrows?.nextIcon"
      :prev="theme.carousel.arrows?.prev"
      :prev-icon="theme.carousel.arrows?.prevIcon"
      :ui="{
        root: theme.carousel.root,
        container: 'items-center transition-[height]',
        item: gridItems,
      }"
      @select="handleSelect"
    >
      <div :class="gridItems">
        <component :is="item.vnode" :key="item.key" />
      </div>
    </UCarousel>
  </div>
</template>
