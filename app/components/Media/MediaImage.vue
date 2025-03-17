<script setup lang="ts">
import type { MediaProps } from '~/types/MediaTypes'

const appConfig = useAppConfig()

defineProps<{ item: MediaProps }>()

const loaded = ref(false)
</script>

<template>
  <div class="relative">
    <USkeleton v-if="!loaded" class="absolute inset-0" />
    <client-only>
      <img
        :alt="item.alt || ''"
        :class="[
          appConfig.stirTheme.media.base,
          appConfig.stirTheme.media.rounded,
          loaded ? 'opacity-100' : 'opacity-0',
          'transition-opacity duration-500 ease-in-out',
        ]"
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
