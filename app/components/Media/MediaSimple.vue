<script setup lang="ts">
import type { Media } from '~/types'

defineProps<{
  media?: Media[]
}>()
</script>

<template>
  <img
    v-for="item in media"
    :key="item.mid"
    :src="item.src"
    :alt="item.alt || ''"
    :class="['rounded-xl shadow-2xl', 'media media-' + item.mid]"
    :width="item.width"
    :height="item.height"
    :srcset="item.srcset"
    :sizes="item.sizes"
    :loading="item.loading || 'lazy'"
  />
</template>
