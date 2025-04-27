<script setup lang="ts">
import { useCalendlyWidget } from '~/composables/useCalendlyWidget'

const props = defineProps<{ calendlyUrl: string }>()

const container = ref<HTMLElement | null>(null)
useCalendlyWidget(container, props.calendlyUrl)
</script>

<template>
  <div ref="container" class="m-auto w-[400px] w-full scheme-normal" />
</template>
