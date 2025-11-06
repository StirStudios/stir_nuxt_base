<script setup lang="ts">
import { useCalendlyWidget } from '~/composables/useCalendlyWidget'

// Accept full item
const props = defineProps<{
  item: { calendlyUrl?: string; calendlyScheme?: string; title?: string }
}>()

const container = ref<HTMLElement | null>(null)

// Use the calendlyUrl from the item
useCalendlyWidget(container, props.item.calendlyUrl || '')
</script>

<template>
  <div ref="container" class="m-auto w-[400px] w-full scheme-normal" />
</template>
