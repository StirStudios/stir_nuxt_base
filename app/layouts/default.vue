<script setup lang="ts">
import { usePageContext } from '~/composables/usePageContext'

const appConfig = useAppConfig()
const { isAdministrator } = usePageContext()
</script>

<template>
  <header aria-label="Site header" :class="appConfig.stirTheme.header">
    <DrupalTabs v-if="isAdministrator" />
    <NavigationMain />
  </header>
  <main id="main-content" role="main" :class="appConfig.stirTheme.main">
    <SiteMessages />
    <slot />
  </main>
  <LazyAppFooter />
</template>
