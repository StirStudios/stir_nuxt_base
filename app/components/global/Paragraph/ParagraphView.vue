<script setup lang="ts">
import type { ViewItemProps } from '~/types/ViewTypes'
import { componentExists } from '~/utils/componentExists'

const props = defineProps<{
  item: ViewItemProps
}>()

const { grid } = useAppConfig().stirTheme

// Filters out 'paragraph-layout' sections
const filteredRows = computed(() =>
  (props.item.rows || []).map((row) => ({
    ...row,
    section: row.section?.filter((node) => node.element !== 'paragraph-layout'),
  })),
)
</script>

<template>
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
        :item-element="item.element"
      />
    </template>

    <div v-else :class="item.gridItems">
      <div v-for="row in filteredRows" :key="row.created" class="item">
        <WrapAnimate :effect="item?.direction">
          <component
            :is="
              componentExists(item.element)
                ? resolveComponent(item.element)
                : 'ParagraphDefault'
            "
            v-bind="{ item: row }"
          />

          <USeparator
            v-if="grid.separator?.condition?.includes(row.element)"
            :color="grid.separator?.color"
            :type="grid.separator?.solid"
            :size="grid.separator?.size"
            :class="grid.separator?.base"
          />
        </WrapAnimate>
      </div>
    </div>
  </div>
</template>
