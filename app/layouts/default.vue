<script setup lang="ts">
import { usePageContext } from '~/composables/usePageContext'

const { page, isAdministrator } = usePageContext()

const heroClasses = computed(() => ({
  'pt-[3.9rem]': isAdministrator,
  'pt-[10rem]': !page.value?.content?.hero,
}))
</script>

<template>
  <header aria-label="Site header">
    <DrupalTabs v-if="isAdministrator" />
    <NavigationMain />
  </header>
  <main id="main-content" role="main" :class="heroClasses">
    <SiteMessages />
    <slot />
  </main>
  <LazyAppFooter />
</template>
