<script setup lang="ts">
const props = defineProps<{
  classes?: string
  gridClasses?: string
  gridItems?: string
  container?: boolean
  width?: string
  card?: boolean
}>()

defineSlots<{ default(): unknown }>()

const { container: themeContainer, card: themeCard } = useAppConfig().stirTheme

const gridClasses = computed(
  () => props.gridItems || props.gridClasses || 'grid-cols-1',
)
</script>

<template>
  <div
    :class="[
      props.container ? themeContainer : '',
      props.card ? themeCard.base : '',
      props.classes,
      props.width,
    ]"
  >
    <div :class="gridClasses">
      <slot />
    </div>
    <CardGradient v-if="props.card" :layout="props" />
  </div>
</template>
