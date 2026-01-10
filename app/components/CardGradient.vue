<script setup lang="ts">
const props = defineProps<{
  layout: {
    card?: boolean
    gradient?: string
  }
}>()

const { gradients, card } = useAppConfig().stirTheme

const gradientClass = computed(() => {
  if (!props.layout.card) return ''

  const key = props.layout.gradient || card.defaultGradient || '1'

  return gradients[key] || ''
})
</script>

<template>
  <div v-if="layout.card" aria-hidden="true" :class="card.effect">
    <div
      class="aspect-[1155/678] w-[72.1875rem] opacity-30"
      :class="gradientClass"
      style="
        clip-path: polygon(
          70% 30%,
          90% 45%,
          100% 40%,
          85% 60%,
          75% 70%,
          55% 65%,
          50% 80%,
          35% 90%,
          20% 75%,
          10% 55%,
          5% 35%,
          20% 10%,
          40% 15%,
          55% 25%,
          70% 30%
        );
      "
    />
  </div>
</template>
