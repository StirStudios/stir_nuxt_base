<script setup lang="ts">
import { useCalendlyWidget } from '~/composables/useCalendlyWidget'
import { ref } from 'vue'

const props = defineProps<{
  calendlyUrl: string
}>()

const container = ref<HTMLElement | null>(null)
useCalendlyWidget(container, props.calendlyUrl)
</script>

<template>
  <div ref="container" class="m-auto h-[1350px] w-[400px] scheme-normal" />
</template>
