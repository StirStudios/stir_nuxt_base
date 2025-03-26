<script setup lang="ts">
const appConfig = useAppConfig()

const props = defineProps<{
  wrapper?: boolean
  header?: string
  classes?: string
}>()

const classes = computed(() => appConfig.stirTheme.grid.wrapCols)
</script>

<template>
  <template v-if="wrapper">
    <h2 v-if="header" class="mb-10 text-center">{{ header }}</h2>
    <div :class="classes">
      <slot />
    </div>
  </template>
  <slot v-else />
</template>
