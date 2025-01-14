<script setup lang="ts">
import type { WrapperProps } from '~/types/UtilityTypes'

defineProps<WrapperProps>()
</script>

<template>
  <component :is="wrapper" v-if="wrapper" class="group relative">
    <slot />
  </component>
  <slot v-else />
</template>
