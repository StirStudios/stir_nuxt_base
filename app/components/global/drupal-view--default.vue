<script setup lang="ts">
import { useSlotsToolkit } from '~/composables/useSlotsToolkit'

const props = defineProps<{
  title?: string
  gridItems?: string
  width?: string
  spacing?: string
  container?: boolean

  /* View-specific additions */
  viewId?: string
  displayId?: string
  parentUuid?: string
  direction?: string

  /* Pagination */
  pager?: { current: number; totalPages: number } | any

  /* Carousel */
  randomize?: boolean
  carousel?: boolean
  carouselArrows?: boolean
  carouselAutoheight?: boolean
  carouselAutoscroll?: boolean
  carouselFade?: boolean
  carouselIndicators?: boolean
  carouselInterval?: number
}>()

const vueSlots = useSlots()
const tk = useSlotsToolkit(vueSlots)

// 1) Raw <rows>
const rawRows = computed(() => tk.slot('rows'))

// 2) Optional shuffle
const slotRows = computed(() =>
  props.randomize ? tk.shuffle(rawRows.value) : rawRows.value,
)
</script>

<template>
  <ParagraphCarousel
    v-if="props.carousel"
    :carousel-arrows="props.carouselArrows"
    :carousel-autoheight="props.carouselAutoheight"
    :carousel-autoscroll="props.carouselAutoscroll"
    :carousel-fade="props.carouselFade"
    :carousel-indicators="props.carouselIndicators"
    :carousel-interval="props.carouselInterval"
    :edit-link="props.editLink"
    :grid-items="props.gridItems"
    :items="slotRows"
    :randomize="props.randomize"
  />

  <Grid
    v-else
    :container="props.container"
    :grid-items="props.gridItems"
    :spacing="props.spacing"
    :width="props.width"
  >
    <template v-for="(node, i) in slotRows" :key="i">
      <component :is="node" />
    </template>
  </Grid>

  <DrupalViewsPagination
    v-if="props.pager && !props.carousel"
    class="mt-8"
    :current="props.pager.current"
    :total-pages="props.pager.totalPages"
  />
</template>
