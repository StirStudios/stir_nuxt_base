<script setup lang="ts">
import type { MediaProps } from '~/types/MediaTypes'

defineProps<{ media?: MediaProps[] }>()
</script>

<template>
  <template v-for="item in media" :key="item.mid">
    <MediaVideo v-if="item.type === 'video'" :item="item" />
    <MediaImage v-else :item="item" />
  </template>
</template>
