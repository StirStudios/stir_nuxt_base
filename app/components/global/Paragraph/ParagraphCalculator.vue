<script setup lang="ts">
import type { RegionItemProps } from '~/types/ContentTypes'

const props = defineProps<{
  item: RegionItemProps
}>()

const embedUrl = props.item.embedUrl
const venueId = props.item.venueId

const { load } = useScript({
  id: 'venue-calculator-script',
  src: embedUrl,
  async: true,
  bundle: true,
})

onMounted(async () => {
  if (!embedUrl || !venueId) return
  await load()
  if (typeof window.initVenueCalculatorWidget === 'function') {
    window.initVenueCalculatorWidget()
  }
})
</script>

<template>
  <ClientOnly>
    <div id="venue-calculator-widget" :data-venue="item.venueId" />
  </ClientOnly>
</template>
