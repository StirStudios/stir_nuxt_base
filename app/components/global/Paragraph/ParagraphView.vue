<script setup lang="ts">
import type { ViewProps } from '~/types/ViewTypes'

const props = defineProps<{
  item: ViewItemProps
}>()

const gridClasses = computed(() => {
  const gridCount = props.item.gridCount
  const classes = {
    2: 'sm:grid-cols-2',
    3: 'sm:grid-cols-2 md:grid-cols-3',
    4: 'sm:grid-cols-2 md:grid-cols-4',
  }

  return `grid gap-5 lg:gap-10 xl:gap-16 ${classes[gridCount] || ''}`.trim()
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
      <div v-else :class="gridClasses">
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
