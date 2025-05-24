<script setup lang="ts">
const { page } = usePageContext()

const calculator = computed(() =>
  page.value.content.section
    .flatMap((s) => s.regions?.first ?? [])
    .find((p) => p.element === 'paragraph-calculator'),
)

const { load } = useScript({
  id: 'venue-calculator-script',
  src: calculator.value?.embedUrl || '',
  async: true,
  bundle: true,
})

onMounted(async () => {
  await load()
  if (typeof window.initVenueCalculatorWidget === 'function') {
    window.initVenueCalculatorWidget()
  }
})
</script>

<template>
  <div
    v-if="calculator"
    id="venue-calculator-widget"
    :data-venue="calculator.venueId"
  />
</template>
