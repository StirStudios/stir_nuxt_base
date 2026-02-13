<script setup lang="ts">
const props = defineProps<{
  id?: number | string
  uuid?: string
  parentUuid?: string
  region?: string

  embedUrl?: string
  venueId?: string

  editLink?: string
}>()

const { load } = useScript({
  id: 'venue-calculator-script',
  src: props.embedUrl ?? '',
  async: true,
})

onMounted(async () => {
  if (!props.embedUrl || !props.venueId) return

  await load()

  if (typeof window.initVenueCalculatorWidget === 'function') {
    window.initVenueCalculatorWidget()
  }
})
</script>

<template>
  <EditLink :link="editLink">
    <ClientOnly>
      <div id="venue-calculator-widget" :data-venue="venueId" />
    </ClientOnly>
  </EditLink>
</template>
