<script setup lang="ts">
import type { MediaProps } from '~/types/MediaTypes'

defineProps<{ item: MediaProps }>()

const { media } = useAppConfig().stirTheme
const loaded = ref(false)
</script>

<template>
  <component
    :is="item.link ? 'a' : 'div'"
    v-bind="
      item.link
        ? { target: '_blank', rel: 'noopener', 'aria-label': item.alt }
        : {}
    "
    :class="['block', media.rounded, 'media group relative overflow-hidden']"
    :href="item.link || undefined"
  >
    <USkeleton v-if="!loaded" class="absolute inset-0" />

    <ClientOnly>
      <img
        :alt="item.alt || ''"
        :class="[
          media.base,
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

    <span
      v-if="item.credit"
      class="absolute right-0 bottom-0 rounded bg-black/40 p-2 text-xs font-bold text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100"
    >
      {{ item.credit }}
    </span>
  </component>
</template>
