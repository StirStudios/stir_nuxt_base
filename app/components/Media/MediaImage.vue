<script setup lang="ts">
import type { MediaProps } from '~/types/MediaTypes'

defineProps<{ item: MediaProps }>()

const { media } = useAppConfig().stirTheme
const loaded = ref(false)
</script>

<template>
  <div class="media relative">
    <USkeleton v-if="!loaded" class="absolute inset-0" />

    <ClientOnly>
      <img
        :alt="item.alt || ''"
        :class="[
          media.base,
          media.rounded,
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
    </ClientOnly>
  </div>
</template>
