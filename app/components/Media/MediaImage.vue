<script setup lang="ts">
import type { MediaProps } from '~/types/MediaTypes'

defineProps<{ item: MediaProps }>()

const loaded = ref(false)
</script>

<template>
  <div class="relative h-full w-full">
    <USkeleton
      v-if="!loaded"
      class="absolute inset-0 h-full w-full object-cover"
    />
    <client-only>
      <img
        :alt="item.alt || ''"
        class="object-cover shadow-2xl transition-opacity duration-500 ease-in-out"
        :class="loaded ? 'opacity-100' : 'opacity-0'"
        :height="item.height"
        :loading="item.loading || 'lazy'"
        :sizes="item.sizes"
        :src="item.src"
        :srcset="item.srcset"
        :width="item.width"
        @load="loaded = true"
      />
    </client-only>
  </div>
</template>
