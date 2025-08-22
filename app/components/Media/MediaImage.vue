<script setup lang="ts">
import type { MediaProps } from '~/types/MediaTypes'

defineProps<{ item: MediaProps; link?: boolean }>()

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
    :class="[
      'media group @container relative block overflow-hidden',
      media.rounded,
    ]"
    :href="item.link || undefined"
  >
    <USkeleton v-if="!loaded" class="absolute inset-0" />

    <ClientOnly>
      <img
        :alt="item.alt || ''"
        :class="[
          media.base,
          loaded ? 'opacity-100' : 'opacity-0',
          link
            ? 'transition-transform duration-500 ease-in-out group-hover:scale-110'
            : '',
        ]"
        :fetchpriority="item.loading === 'eager' ? 'high' : undefined"
        :height="item.height"
        :loading="item.loading || 'lazy'"
        :sizes="item.sizes"
        :src="item.src"
        :srcset="item.srcset"
        :width="item.width"
        @load="loaded = true"
      />

      <span
        v-if="item.credit"
        class="absolute bottom-0 left-0 w-full translate-x-0 bg-black/40 px-2 py-1 text-center text-xs font-bold text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 @xs:left-1/2 @xs:w-auto @xs:-translate-x-1/2"
      >
        {{ item.credit }}
      </span>
    </ClientOnly>
  </component>
</template>
