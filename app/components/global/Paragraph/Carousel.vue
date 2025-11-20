<script setup lang="ts">
const props = defineProps<{
  items: any[]
  gridItems?: string
  editLink?: string
  carouselIndicators?: boolean
  carouselArrows?: boolean
  carouselFade?: boolean
  carouselAutoscroll?: boolean
  carouselAutoheight?: boolean
  carouselInterval?: number
}>()

const carousel = useTemplateRef<'carousel'>('carousel')
const theme = useAppConfig().stirTheme

// No randomize. No sorting. Just a clean map.
const slides = computed(() => {
  return (props.items ?? []).map((vnode, i) => ({
    vnode,
    key: vnode.key || i,
  }))
})

/* -------------------------------------------------------
   AUTOSCROLL SPEED (old logic preserved)
------------------------------------------------------- */
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

const autoScrollOptions = computed(() => ({
  stopOnMouseEnter: true,
  stopOnInteraction: false,
  speed: props.carouselAutoscroll ? autoScrollSpeed.value : 0,
}))

const autoplayOptions = computed(() =>
  !props.carouselAutoscroll ? { delay: interval.value } : false,
)

/* -------------------------------------------------------
   RESET AUTOSCROLL + AUTOPLAY WHEN MANUALLY SELECTED
------------------------------------------------------- */
function handleSelect() {
  const plugins = carousel.value?.emblaApi?.plugins?.()
  plugins?.autoplay?.reset?.()
  plugins?.autoScroll?.reset?.()
}
</script>

<template>
  <div class="relative z-10" :class="theme.carousel.padding">
    <UCarousel
      v-if="slides.length"
      ref="carousel"
      v-slot="{ item }"
      :arrows="props.carouselArrows"
      :auto-height="props.carouselAutoheight"
      :auto-scroll="autoScrollOptions"
      :autoplay="autoplayOptions"
      :dots="props.carouselIndicators"
      :fade="props.carouselFade"
      :items="slides"
      loop
      :next="theme.carousel.arrows?.next"
      :next-icon="theme.carousel.arrows?.nextIcon"
      :prev="theme.carousel.arrows?.prev"
      :prev-icon="theme.carousel.arrows?.prevIcon"
      :ui="{
        root: theme.carousel.root,
        container: 'items-center transition-[height]',
        item: props.gridItems,
      }"
      @select="handleSelect"
    >
      <div :class="props.gridItems">
        <component :is="item.vnode" :key="item.key" />
      </div>
    </UCarousel>
  </div>
</template>
