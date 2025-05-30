<script lang="ts" setup>
import { usePageContext } from '~/composables/usePageContext'

const { isAdministrator } = usePageContext()
const appConfig = useAppConfig()
</script>

<template>
  <UApp>
    <NuxtLoadingIndicator
      :color="appConfig.stirTheme.loadingIndicator || undefined"
    />
    <UButton
      aria-label="Skip to main content"
      class="absolute top-0 left-0 z-50 m-3 -translate-y-96 p-3 transition focus:translate-y-0"
      color="primary"
      label="Skip to main content"
      tabindex="0"
      to="#main-content"
      variant="solid"
    />
    <header aria-label="Site header" :class="appConfig.stirTheme.header">
      <DrupalTabs v-if="isAdministrator" />
      <NavigationMain />
    </header>
    <NuxtPage />
    <LazyAppScrollToTop />
    <CookieConsent />
  </UApp>
</template>
