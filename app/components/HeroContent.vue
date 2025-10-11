<script setup lang="ts">
import type { RegionItemProps } from '~/types'

withDefaults(
  defineProps<{
    pageTitle?: string
    siteSlogan?: string
    heroText?: string
    isFront?: boolean
    button?: RegionItemProps[]
  }>(),
  {
    pageTitle: '',
    siteSlogan: '',
    heroText: '',
    isFront: false,
    button: undefined,
  },
)
</script>

<template>
  <template v-if="pageTitle && isFront">
    <h1>{{ pageTitle }}</h1>
    <h2 class="display-h1 text-left">{{ siteSlogan }}</h2>
  </template>
  <h1 v-else-if="pageTitle" class="mb-0 text-white">
    {{ pageTitle }}
  </h1>
  <div v-if="heroText" class="hero-copy prose" v-html="heroText" />
  <ParagraphButton v-if="button" :item="button" />
</template>
