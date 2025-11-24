<script setup lang="ts">
import { useCalendlyWidget } from '~/composables/useCalendlyWidget'

const props = defineProps<{
  /* CE identity */
  id?: number | string
  uuid?: string
  parentUuid?: string
  region?: string

  /* Calendly integration */
  calendlyUrl?: string
  calendlyScheme?: string
  title?: string

  /* CE extras */
  editLink?: string
}>()

const container = ref<HTMLElement | null>(null)

// Apply Calendly embed
useCalendlyWidget(container, props.calendlyUrl || '')
</script>

<template>
  <EditLink :link="editLink">
    <div ref="container" class="m-auto w-full scheme-normal" />
  </EditLink>
</template>
