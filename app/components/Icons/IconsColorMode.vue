<script setup>
import useDarkMode from '~/composables/useDarkMode'

const appConfig = useAppConfig()
const { isDark } = useDarkMode()
</script>

<template>
  <ClientOnly v-if="!appConfig.colorMode?.forced">
    <UButton
      aria-label="Theme"
      color="black"
      :icon="isDark ? 'i-lucide-moon' : 'i-lucide-sun'"
      size="lg"
      variant="ghost"
      @click="isDark = !isDark"
    />

    <template #fallback>
      <div class="size-8" />
    </template>
  </ClientOnly>
</template>
