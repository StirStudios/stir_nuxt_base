<script setup lang="ts">
import type { MediaProps } from '~/types'
import { aspectRatios } from '~/utils/aspectRatios'

const { item, link } = defineProps<{ item: MediaProps; link?: boolean }>()
const { media } = useAppConfig().stirTheme

const isEager = computed(() => item?.loading === 'eager')
</script>

<template>
  <component
    :is="item?.link ? 'a' : 'div'"
    v-bind="
      item?.link
        ? { target: '_blank', rel: 'noopener', 'aria-label': item.alt }
        : {}
    "
    :class="[
      'media group @container relative block overflow-hidden',
      media.rounded,
    ]"
    :href="item?.link || undefined"
  >
    <ClientOnly v-if="!isEager" fallback-tag="div">
      <template #default>
        <img
          :alt="item.alt || ''"
          :class="[
            item.platform === 'instagram' ? 'aspect-3/4' : '',
            media.base,
            link
              ? 'transition-transform duration-500 ease-in-out group-hover:scale-110'
              : '',
          ]"
          :fetchpriority="undefined"
          :height="item.height"
          :loading="item.loading || 'lazy'"
          :sizes="item.sizes"
          :src="item.src"
          :srcset="item.srcset"
          :width="item.width"
        />
      </template>
      <template #fallback>
        <USkeleton
          class="w-full"
          :class="aspectRatios(item.width, item.height) || 'aspect-[4/3]'"
        />
      </template>
    </ClientOnly>

    <img
      v-else
      :alt="item.alt || ''"
      :class="[
        media.base,
        link
          ? 'transition-transform duration-500 ease-in-out group-hover:scale-110'
          : '',
      ]"
      fetchpriority="high"
      :height="item.height"
      loading="eager"
      :sizes="item.sizes"
      :src="item.src"
      :srcset="item.srcset"
      :width="item.width"
    />

    <ClientOnly>
      <div
        v-if="item.platform === 'instagram'"
        class="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/90 px-4 text-center text-sm font-semibold text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      >
        <div class="line-clamp-5 max-w-full leading-relaxed break-words">
          {{ item.title }}
        </div>

        <UButton class="mt-5" size="sm" :to="item?.link" variant="outline">
          View on Instagram
        </UButton>
      </div>

      <span
        v-else-if="item.credit"
        class="absolute bottom-0 left-0 w-full translate-x-0 bg-black/40 px-2 py-1 text-center text-xs font-bold text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 @xs:left-1/2 @xs:w-auto @xs:-translate-x-1/2"
      >
        {{ item.credit }}
      </span>
    </ClientOnly>
  </component>
</template>
