<script setup>
import useDarkMode from '~/composables/useDarkMode'

const appConfig = useAppConfig()
const { isDark, colorMode } = useDarkMode()
</script>

<template>
  <ClientOnly v-if="!appConfig.colorMode?.forced">
    <UButton
      aria-label="Theme"
      :icon="isDark ? 'i-heroicons-moon-20-solid' : 'i-heroicons-sun-20-solid'"
      color="black"
      variant="ghost"
      size="lg"
      @click="isDark = !isDark"
    />
    <template #fallback>
      <div class="size-8" />
    </template>
  </ClientOnly>
</template>
