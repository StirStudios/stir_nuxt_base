<script setup lang="ts">
import type { ViewProps } from '~/types/ViewTypes'

const appConfig = useAppConfig()

const props = defineProps<{
  item: ViewItemProps
}>()

/**
 * Computes the grid classes dynamically.
 */
const viewGridClasses = computed(() => {
  const { viewGap } = appConfig.stirTheme.grid
  return [viewGap, props.item.gridItems].filter(Boolean).join(' ')
})

/**
 * Filters out 'paragraph-layout' sections.
 */
const filteredRows = computed(() => {
  return (props.item.rows || []).map((row) => ({
    ...row,
    section: row.section?.filter((node) => node.element !== 'paragraph-layout'),
  }))
})

/**
 * Constructs node props dynamically.
 */
const getNodeProps = (node, title) => ({
  item: {
    title,
    ...node,
  },
})
</script>

<template>
  <WrapAnimate
    :aos="item?.direction"
    :wrapper="item?.animate === true ? 'div' : undefined"
  >
    <h3 v-if="item.title">{{ item.title }}</h3>
    <div :class="[!item.carousel ? item.width : '', item.spacing]">
      <template v-if="item.carousel">
        <ParagraphCarousel
          :amount="item.gridItems"
          :indicators="item.carouselIndicators"
          :arrows="item.carouselArrows"
          :fade="item.carouselFade"
          :autoscroll="item.carouselAutoscroll"
          :interval="item.carouselInterval"
          :items="filteredRows"
          :vid="item.viewId"
        />
      </template>
      <div v-else :class="viewGridClasses">
        <div v-for="row in filteredRows" :key="row.created" class="item">
          <component
            :is="resolveComponent(node.element)"
            v-for="node in row.section"
            :key="node.uuid"
            v-bind="getNodeProps(node, row.title)"
          />
          <USeparator
            v-if="
              appConfig.stirTheme.grid.separator?.condition?.includes(
                row.element,
              )
            "
            :color="appConfig.stirTheme.grid.separator?.color"
            :type="appConfig.stirTheme.grid.separator?.solid"
            :size="appConfig.stirTheme.grid.separator?.size"
            :class="appConfig.stirTheme.grid.separator?.base"
          />
        </div>
      </div>
    </div>
  </WrapAnimate>
</template>
