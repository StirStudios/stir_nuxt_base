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
      :class="[
        'relative w-full overflow-hidden rounded-xl xl:max-w-[50vw]',
        appConfig.stirTheme.mediaRounded,
        aspectRatios(item.width, item.height),
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
    <client-only v-else>
      <img
        :alt="item.alt || ''"
        :class="[
          'object-fit shadow-2xl transition-opacity duration-1000 ease-in-out',
          'media media-' + item.mid,
          appConfig.stirTheme.mediaRounded,
          aspectRatios(item.width, item.height),
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
