<script lang="ts" setup>
const appConfig = useAppConfig()
</script>

<template>
  <NuxtLoadingIndicator
    :color="appConfig.stirTheme.loadingIndicator || undefined"
  />
  <a
    href="#main-content"
    class="bg-primary absolute left-0 top-0 z-50 m-3 -translate-y-96 p-3 text-black transition focus:translate-y-0"
  >
    Skip to main content
  </a>
  <NuxtPage />
  <UNotifications />
  <LazyAppScrollToTop />
</template>
