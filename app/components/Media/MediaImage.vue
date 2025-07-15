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
    :class="['media group relative block overflow-hidden', media.rounded]"
    :href="item.link || undefined"
  >
    <USkeleton v-if="!loaded" class="absolute inset-0" />

    <ClientOnly>
      <img
        :alt="item.alt || ''"
        :class="[
          media.base,
          loaded ? 'opacity-100' : 'opacity-0',
          item.link
            ? 'transition-transform duration-500 ease-in-out group-hover:scale-110'
            : '',
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
      class="absolute bottom-0 left-1/2 -translate-x-1/2 transform rounded bg-black/40 px-2 py-1 text-xs font-bold text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100"
    >
      {{ item.credit }}
    </span>
  </component>
</template>
