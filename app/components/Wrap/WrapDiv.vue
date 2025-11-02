<script setup lang="ts">
defineProps<{
  styles?: string | string[]
  align?: string
}>()
</script>

<template>
  <WrapAlign :align="align">
    <div v-if="styles" :class="styles">
      <slot />
    </div>
    <slot v-else />
  </WrapAlign>
</template>
