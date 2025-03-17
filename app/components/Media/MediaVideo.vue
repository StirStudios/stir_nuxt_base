<script setup lang="ts">
import type { MediaProps } from '~/types/MediaTypes'
import { aspectRatios } from '~/utils/aspectRatios'

const appConfig = useAppConfig()

defineProps<{ item: MediaProps }>()
</script>

<template>
  <div
    v-if="item.mediaEmbed"
    :class="[
      appConfig.stirTheme.media.base,
      appConfig.stirTheme.media.rounded,
      aspectRatios(item.width, item.height),
    ]"
  >
    <div
      v-if="item.width === 180"
      class="relative flex aspect-[16/9] w-full flex-col items-center justify-center rounded-lg bg-gradient-to-br from-slate-700 to-zinc-800"
    >
      <UIcon class="mb-2 size-16 text-white" name="i-heroicons-clock" />
      <span class="text-lg font-semibold text-white">
        Video is Processing...
      </span>
    </div>
    <iframe
      v-else
      :src="item.mediaEmbed"
      :title="item.title"
      :data-mid="item.mid"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      class="absolute inset-0 h-full w-full"
      frameborder="0"
      loading="lazy"
      allowfullscreen
    />
  </div>
</template>
