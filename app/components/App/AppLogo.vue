<script setup lang="ts">
import { useAppLogo } from '~/composables/useAppLogo'

const props = defineProps<{
  class?: string
  logoSize?: string
}>()

const { slotProps } = useAppLogo(props)
</script>

<template>
  <slot v-bind="slotProps"> Add SVG logo here </slot>
</template>
