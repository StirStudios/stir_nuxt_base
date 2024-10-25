<script setup lang="ts">
defineProps({
  wrapper: undefined,
  classes: 'group relative',
})
</script>

<template>
  <component :is="wrapper" v-if="wrapper" :class="classes">
    <slot />
  </component>
  <slot v-else />
</template>
