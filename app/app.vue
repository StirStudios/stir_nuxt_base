<script lang="ts" setup>
const appConfig = useAppConfig()
</script>

<template>
  <UApp>
    <NuxtLoadingIndicator
      :color="appConfig.stirTheme.loadingIndicator || undefined"
    />
    <a
      href="#main-content"
      tabindex="0"
      aria-label="Skip to main content"
      class="bg-primary absolute top-0 left-0 z-50 m-3 -translate-y-96 p-3 text-black transition focus:translate-y-0"
    >
      Skip to main content
    </a>
    <NuxtPage />
    <LazyAppScrollToTop />
  </UApp>
</template>
