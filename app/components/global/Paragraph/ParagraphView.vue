<script setup lang="ts">
import type { ViewProps } from '~/types/ViewTypes'

const appConfig = useAppConfig()

const props = defineProps<{
  item: ViewItemProps
}>()

const viewGridClasses = computed(() => {
  const { viewCols, viewGap } = appConfig.stirTheme.grid
  const gridCount = props.item.gridCount

  return `grid ${viewGap} ${viewGrid[gridCount] || ''}`.trim()
})

const filteredRows = computed(
  () =>
    props.item.rows?.map((row) => ({
      ...row,
      section: row.section?.filter(
        (node) => node.element !== 'paragraph-layout',
      ),
    })) || [],
)

const getNodeProps = (node, title) => {
  return {
    item: {
      title: title,
      ...node,
    },
  }
}
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
          :amount="item.gridCount"
          :indicators="item.carouselIndicators"
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
        </div>
      </div>
    </div>
  </WrapAnimate>
</template>
