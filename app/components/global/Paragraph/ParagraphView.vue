<script setup lang="ts">
import type { ViewItemProps } from '~/types/ViewTypes'
import { componentExists, resolveComponentName } from '~/utils/componentExists'

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
  <div :class="[item.width, item.spacing]">
    <template v-if="item.carousel">
      <ParagraphCarousel
        :amount="item.gridItems"
        :arrows="item.carouselArrows"
        :autoscroll="item.carouselAutoscroll"
        :fade="item.carouselFade"
        :indicators="item.carouselIndicators"
        :interval="item.carouselInterval"
        :item-element="item.element"
        :items="filteredRows"
        :vid="item.viewId"
      />
    </template>

    <div v-else :class="item.gridItems">
      <div v-for="row in filteredRows" :key="row.created" class="item">
        <WrapAnimate :effect="item?.direction">
          <component
            :is="
              componentExists(item.element)
                ? resolveComponentName(item.element)
                : 'ParagraphDefault'
            "
            v-bind="{ item: row }"
          />

          <USeparator
            v-if="grid.separator?.condition?.includes(row.element)"
            :class="grid.separator?.base"
            :color="grid.separator?.color"
            :size="grid.separator?.size"
            :type="grid.separator?.solid"
          />
        </WrapAnimate>
      </div>
    </div>
  </div>
</template>
