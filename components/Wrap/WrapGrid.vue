<script setup lang="ts">
import type { CommonSettings } from '../types'

withDefaults(defineProps<CommonSettings>(), {
  wrapper: undefined,
  classes: 'grid gap-5 lg:gap-10 xl:gap-16 grid-cols-2 lg:grid-cols-4',
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
