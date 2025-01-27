<script setup lang="ts">
import type { MediaProps } from '~/types/MediaTypes'
import { aspectRatios } from '~/utils/aspectRatios'

const appConfig = useAppConfig()

defineProps<{
  media?: MediaProps[]
}>()

const loadedImages = reactive<{ [key: string]: boolean }>({})
</script>

<template>
  <template v-for="item in media" :key="item.mid">
    <div
      v-if="item.mediaEmbed"
      :class="[
        'relative w-full overflow-hidden rounded-xl xl:max-w-[50vw]',
        appConfig.stirTheme.mediaRounded,
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
        class="absolute left-0 top-0 h-full w-full"
        frameborder="0"
        loading="lazy"
        allowfullscreen
      />
    </div>
    <client-only v-else>
      <img
        :alt="item.alt || ''"
        :class="[
          'object-fit shadow-2xl transition-opacity duration-1000 ease-in-out',
          'media media-' + item.mid,
          appConfig.stirTheme.mediaRounded,
          {
            'opacity-100': loadedImages[item.mid],
            'opacity-0': !loadedImages[item.mid],
          },
        ]"
        :height="item.height"
        :loading="item.loading || 'lazy'"
        :sizes="item.sizes"
        :src="item.src"
        :srcset="item.srcset"
        :width="item.width"
        @load="loadedImages[item.mid] = true"
      />
    </client-only>
  </template>
</template>
