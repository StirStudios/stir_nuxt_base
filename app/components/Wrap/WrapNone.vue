<script setup lang="ts">
defineProps({
  wrapper: undefined,
})
</script>

<template>
  <component :is="wrapper" v-if="wrapper" class="group relative">
    <slot />
  </component>
  <slot v-else />
</template>
