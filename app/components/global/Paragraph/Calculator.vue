<script setup lang="ts">
const props = defineProps<{
  /* Identity */
  id?: number | string
  uuid?: string
  parentUuid?: string
  region?: string

  /* Calculator embed */
  embedUrl?: string
  venueId?: string

  /* Editing */
  editLink?: string
}>()

const { load } = useScript({
  id: 'venue-calculator-script',
  src: props.embedUrl,
  async: true,
  bundle: true,
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
