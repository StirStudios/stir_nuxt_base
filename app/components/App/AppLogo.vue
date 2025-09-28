<script setup lang="ts">
import useDarkMode from '~/composables/useDarkMode'

const { isDark } = useDarkMode()

const logoFillColor = computed(() => {
  return isDark.value ? 'fill-white' : 'fill-black'
})
</script>

<template>
  <ClientOnly>
    Add SVG Logo Here
    <!-- <svg
    xmlns="http://www.w3.org/2000/svg"
    xml:space="preserve"
    viewBox="0 0 2400 1920"
    :class="logoFillColor"
  ></svg> -->
  </ClientOnly>
</template>
