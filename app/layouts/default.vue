<script setup lang="ts">
import { usePageContext } from '~/composables/usePageContext'

const { isAdministrator } = usePageContext()
</script>

<template>
  <LazyDrupalTabs v-if="!isAdministrator" />
</template>
