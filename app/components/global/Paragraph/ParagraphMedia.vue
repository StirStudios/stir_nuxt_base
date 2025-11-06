<script setup lang="ts">
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'

const breakpoints = useBreakpoints(breakpointsTailwind)

const props = defineProps<{
  gridItems?: string
  spacing?: string
  widthClass?: string
  overlay?: boolean
  align?: string
  direction?: string
  editLink?: string
  header?: string
}>()

// Compute combined grid + width + spacing classes
const gridClasses = computed(() =>
  props.overlay
    ? ''
    : [props.gridItems, props.widthClass, props.spacing]
        .filter(Boolean)
        .join(' '),
)
</script>

<template>
  <EditLink :link="props.editLink">
    <WrapAlign :align="props.align">
      <WrapGrid :classes="gridClasses" :header="props.header">
        <!-- Overlay Mode (popup/gallery-ready) -->
        <WrapAnimate
          v-if="props.overlay"
          class="relative"
          :effect="props.direction"
        >
          <div
            class="aspect-wrap group relative overflow-hidden"
            :class="[props.gridItems]"
          >
            <slot name="media" />
          </div>
        </WrapAnimate>

        <!-- Normal Grid Mode (plain layout) -->
        <template v-else>
          <WrapAnimate :effect="props.direction">
            <div
              class="aspect-wrap group relative overflow-hidden"
              :class="[props.gridItems]"
            >
              <slot name="media" />
            </div>
          </WrapAnimate>
        </template>
      </WrapGrid>
    </WrapAlign>
  </EditLink>
</template>
