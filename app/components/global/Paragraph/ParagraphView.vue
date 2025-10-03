<script setup lang="ts">
import type { ViewItemProps } from '~/types/ViewTypes'
import { componentExists, resolveComponentName } from '~/utils/componentExists'
import { useShuffledOrder } from '~/composables/useShuffledOrder'

const props = defineProps<{
  item: ViewItemProps
}>()

const { grid } = useAppConfig().stirTheme

// Filter out 'paragraph-layout' sections before passing to shuffle
const initialRows = (props.item.content?.rows || []).map((row) => ({
  ...row,
  section: row.section?.filter((node) => node.element !== 'paragraph-layout'),
}))

// Shuffle if randomize is enabled
const filteredRows = useShuffledOrder(initialRows, props.item.randomize)
</script>

<template>
  <WrapDiv :align="item.align" :styles="[item.width, item.spacing]">
    <template v-if="item.carousel">
      <ParagraphCarousel :item="{ ...item, items: filteredRows }" />
    </template>

    <div v-else :class="item.gridItems">
      <div v-for="row in filteredRows" :key="row.created" class="item">
        <WrapAnimate :effect="item?.direction">
          <component
            :is="
              componentExists(row.element)
                ? resolveComponentName(row.element)
                : 'ParagraphDefault'
            "
            :item="row"
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
  </WrapDiv>
</template>
