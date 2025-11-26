<script setup lang="ts">
import { usePageContext } from '~/composables/usePageContext'
const { pageLayout } = usePageContext()

defineProps<{
  // Core media info
  title: string
  created: string
  uid?: string | object
  hide?: boolean | string

  // Routing + path info
  path?: {
    alias: string
    pid: string
    langcode: string
  }

  // Navigation (prev/next nodes)
  prev_node?: {
    nid: string
    title: string
    url: string
  } | null

  next_node?: {
    nid: string
    title: string
    url: string
  } | null
}>()

defineSlots<{
  hero?(): unknown
  section?(): unknown
}>()
</script>

<template>
  <slot v-if="pageLayout !== 'clear'" name="hero" />
  <LazyRegionArea area="before_main" />
  <slot name="section" />
</template>
