<script setup lang="ts">
const { isAdministrator } = usePageContext()
const { header } = useAppConfig().stirTheme
</script>

<template>
  <header aria-label="Site header" :class="header">
    <DrupalTabs v-if="isAdministrator" />
  </header>

  <main id="main-content" role="main">
    <slot />
  </main>
</template>
