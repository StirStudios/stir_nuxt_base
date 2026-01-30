<script setup lang="ts">
import { useCalendlyWidget } from '~/composables/useCalendlyWidget'

const props = defineProps<{
  id?: number | string
  uuid?: string
  parentUuid?: string
  region?: string

  calendlyUrl?: string
  calendlyScheme?: string
  title?: string

  editLink?: string
}>()

const container = ref<HTMLElement | null>(null)

useCalendlyWidget(container, props.calendlyUrl || '')
</script>

<template>
  <EditLink :link="editLink">
    <div ref="container" class="m-auto w-full scheme-normal" />
  </EditLink>
</template>
