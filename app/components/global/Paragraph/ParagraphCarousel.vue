<script setup lang="ts">
import type { CarouselProps } from '@stir/base/types/MediaTypes'

const appConfig = useAppConfig()

const props = defineProps<CarouselProps>()

const carouselRef = ref()
const isHovered = ref(false)

let intervalId: number | undefined

const startCarousel = () => {
  intervalId = setInterval(() => {
    if (!carouselRef.value || isHovered.value) return

    if (carouselRef.value.page === carouselRef.value.pages) {
      return carouselRef.value.select(0)
    }

    carouselRef.value.next()
  }, props.interval)
}

const stopCarousel = () => {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = undefined
  }
}

onMounted(() => {
  startCarousel()
})

onUnmounted(() => {
  stopCarousel()
})

const showIndicators = computed(() => {
  return props.indicators ? { indicators: true } : {}
})

const dynamicClass = computed(() => {
  const mdFraction = props.amount > 2 ? props.amount - 1 : 2
  const basisFraction =
    props.amount > 1
      ? `md:basis-1/${mdFraction} lg:basis-1/${props.amount}`
      : 'basis-full slide'
  return basisFraction.trim()
})
</script>

<template>
  <div
    class="relative z-10"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <h2 v-if="header" class="mb-5">{{ header }}</h2>
    <UCarousel
      ref="carouselRef"
      v-bind="showIndicators"
      v-slot="{ item }"
      :items="items"
      :ui="{
        container: `${appConfig.stirTheme.carousel.container} ${width ? width + ' ' : ''}slider`,
        item:
          items[0]?.type === 'media'
            ? `${dynamicClass} ${appConfig.stirTheme.carousel.mediaHeight}`
            : `${dynamicClass} ${appConfig.stirTheme.carousel.mediaRounded || appConfig.stirTheme.mediaRounded}`,
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
        <img
          v-if="item.type === 'image'"
          :alt="item.alt"
          class="h-28 w-full object-contain px-4 py-2"
          draggable="false"
          :height="item.height"
          :loading="item.loading"
          :sizes="item.sizes"
          :src="item.src"
          :srcset="item.srcset"
          :width="item.width"
        />
      </template>
    </UCarousel>
  </div>
</template>
