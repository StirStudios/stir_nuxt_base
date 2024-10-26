<script setup lang="ts">
import type { CarouselProps } from '~/types/MediaTypes'

const props = defineProps<CarouselProps>()

const carouselRef = ref()

onMounted(() => {
  setInterval(() => {
    if (!carouselRef.value) return

    if (carouselRef.value.page === carouselRef.value.pages) {
      return carouselRef.value.select(0)
    }

    carouselRef.value.next()
  }, props.interval)
})

const showIndicators = computed(() => {
  return props.indicators ? true : false
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
  <div class="relative z-10">
    <h2 v-if="header" class="mb-5">{{ header }}</h2>
    <UCarousel
      ref="carouselRef"
      v-bind="showIndicators"
      v-slot="{ item }"
      :items="items"
      :ui="{
        container: `rounded-lg gap-10 slider ${width}`,
        item:
          items[0]?.type === 'media' ? dynamicClass + ' h-64' : dynamicClass,
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
