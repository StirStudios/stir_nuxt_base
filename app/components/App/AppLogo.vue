<script setup lang="ts">
defineProps<{
  darkMode?: boolean
}>()
</script>

<template>
  <span :class="{ 'dark-mode': darkMode }">Your logo SVG here</span>
</template>

<style scoped>
.logo {
  fill: #ffffff;
}
.dark-mode {
  fill: #000000;
}
</style>
