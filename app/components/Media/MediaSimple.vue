<script setup lang="ts">
import type { MediaProps } from '~/types/MediaTypes'

defineProps<{
  media?: MediaProps[]
}>()
</script>

<template>
  <template v-for="item in media" :key="item.mid">
    <div
      :class="[
        'relative w-full overflow-hidden rounded-xl xl:max-w-[50vw]',
        aspectRatioClass(item.width, item.height),
      ]"
      v-if="item.mediaEmbed"
    >
      <iframe
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        class="absolute left-0 top-0 h-full w-full"
        frameborder="0"
        loading="lazy"
        :src="item.mediaEmbed"
        :title="item.title"
        allowfullscreen
      />
    </div>
    <img
      v-else
      :alt="item.alt || ''"
      :class="[
        'object-fit shadow-2xl',
        'media media-' + item.mid,
        aspectRatioClass(item.width, item.height),
      ]"
      :height="item.height"
      :loading="item.loading || 'lazy'"
      :sizes="item.sizes"
      :src="item.src"
      :srcset="item.srcset"
      :width="item.width"
    />
  </template>
</template>
