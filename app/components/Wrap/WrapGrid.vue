<script setup lang="ts">
import type { LayoutProps } from '~/types/UtilityTypes'

const appConfig = useAppConfig()

withDefaults(defineProps<LayoutProps>(), {
  wrapper: undefined,
  classes: appConfig.stirTheme.grid.wrapCols,
})
</script>

<template>
  <template v-if="wrapper">
    <h2 v-if="header" class="mb-10 text-center">{{ header }}</h2>
    <component :is="wrapper" :class="classes">
      <slot />
    </component>
  </template>
  <template v-else>
    <slot />
  </template>
</template>
