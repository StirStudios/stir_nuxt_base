<script lang="ts" setup>
import type { MediaProps } from '~/types/MediaTypes'
import { aspectRatios } from '~/utils/aspectRatios'

const appConfig = useAppConfig()

const props = defineProps<{
  media?: MediaProps[]
}>()

const modal = ref(false)
</script>

<template>
  <div v-if="media && media.length" class="space-y-4">
    <div
      v-for="(item, index) in media"
      :key="index"
      :class="[appConfig.stirTheme.media.rounded, 'overflow-hidden']"
    >
      <div
        :class="[
          'relative transform-gpu overflow-hidden transition-all duration-500 ease-in-out will-change-transform hover:scale-110',
          aspectRatios(item.width, item.height),
          item.mediaEmbed
            ? 'brightness-50 transition-all group-hover:brightness-75'
            : '',
        ]"
      >
        <MediaImage v-if="item.srcset" :item="item" />
        <button
          aria-label="Play Video"
          class="group absolute inset-0 z-10 flex cursor-pointer items-center justify-center text-white"
          @click="modal = !modal"
        >
          <UIcon
            v-if="item.mediaEmbed"
            aria-hidden="true"
            aria-label="Play Video"
            class="transform-gpu transition-all duration-500 ease-in-out will-change-transform hover:scale-125 hover:drop-shadow-md"
            color="white"
            name="i-heroicons-play-circle"
            size="60"
          />
          <span class="sr-only">Play Video</span>
        </button>
      </div>
      <UModal
        v-model:open="modal"
        :title="item.alt"
        :description="item.alt"
        :ui="{
          content: 'max-w-5xl',
          body: item.mediaEmbed ? 'flex items-center justify-center' : 'm-auto',
          description: 'sr-only',
        }"
      >
        <template #body>
          <MediaVideo v-if="item.mediaEmbed" :item="item" />
          <MediaImage v-else-if="item.src" :item="item" />
        </template>
      </UModal>
    </div>
  </div>
</template>
