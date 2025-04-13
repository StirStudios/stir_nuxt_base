<script setup lang="ts">
import type { ViewItemProps } from '~/types/ViewTypes'
import { componentExists } from '~/utils/componentExists'

const props = defineProps<{
  item: ViewItemProps
}>()

const { grid } = useAppConfig().stirTheme

const rows = computed(() => props.item.rows || [])
</script>

<template>
  <div :class="[item.width, item.spacing]">
    <template v-if="item.carousel">
      <ParagraphCarousel :item="item" :items="rows" />
    </template>

    <div v-else :class="item.gridItems">
      <div v-for="row in rows" :key="row.created" class="item">
        <WrapAnimate :effect="item?.direction">
          <component
            :is="
              componentExists(row.element)
                ? resolveComponent(row.element)
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
