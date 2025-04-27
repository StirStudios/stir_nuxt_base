<script setup lang="ts">
import { usePageContext } from '~/composables/usePageContext'

const { isAdministrator } = usePageContext()
const appConfig = useAppConfig()
</script>

<template>
  <header aria-label="Site header" :class="appConfig.stirTheme.header">
    <DrupalTabs v-if="isAdministrator" />
    <NavigationMain />
  </header>
  <main id="main-content" role="main">
    <SiteMessages />
    <slot />
  </main>
  <LazyAppFooter />
</template>
