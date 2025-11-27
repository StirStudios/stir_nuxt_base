<script setup lang="ts">
import { usePageContext } from '~/composables/usePageContext'
const { pageLayout } = usePageContext()

defineOptions({
  inheritAttrs: false,
})

const props = defineProps<{
  // Core media info
  title: string
  type?: string
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

const slots = useSlots()
const teaser = useNodeTeaser(slots)

const isTeaser = computed(() => props.type?.includes('teaser'))
</script>

<template>
  <slot v-if="pageLayout !== 'clear' && !isTeaser" name="hero" />
  <LazyRegionArea area="before_main" />
  <NodeTeaser
    v-if="isTeaser"
    :created="props.created"
    orientation="horizontal"
    :teaser="teaser"
    :title="props.title"
    :url="props.path?.alias"
  />
  <slot v-else name="section" />
</template>
