<script lang="ts" setup>
import type { MediaProps } from '~/types/MediaTypes'
import { aspectRatios } from '~/utils/aspectRatios'

const appConfig = useAppConfig()

const props = defineProps<{
  media?: MediaProps[]
}>()

const modal = ref(false)
const activeMedia = ref<MediaProps | null>(null)

const openModal = (item: MediaProps) => {
  activeMedia.value = item
  modal.value = true
}
</script>

<template>
  <div v-if="media?.length" class="space-y-4">
    <div
      v-for="(item, index) in media"
      :key="index"
      :class="[appConfig.stirTheme.media.rounded, 'group overflow-hidden']"
    >
      <div
        :class="[
          'relative transform-gpu overflow-hidden transition-all duration-500 ease-in-out will-change-transform hover:scale-110',
          aspectRatios(item.width, item.height),
        ]"
      >
        <MediaImage v-if="item.srcset" :item="item" />
        <div
          v-if="item.mediaEmbed"
          class="absolute inset-0 z-10 bg-black opacity-50 transition-opacity duration-300 group-hover:opacity-30"
        />
        <button
          aria-label="Play Video"
          class="absolute inset-0 z-20 flex cursor-pointer items-center justify-center text-white transition-transform duration-500 ease-in-out hover:scale-125 hover:drop-shadow-md"
          @click="openModal(item)"
        >
          <UIcon
            v-if="item.mediaEmbed"
            name="i-heroicons-play-circle"
            size="60"
            color="white"
            aria-hidden="true"
          />
          <span class="sr-only">Play Video</span>
        </button>
      </div>
    </div>
    <UModal
      v-model:open="modal"
      v-if="activeMedia"
      :title="activeMedia?.alt"
      :description="activeMedia?.alt"
      :ui="{
        content: 'max-w-5xl',
        body: activeMedia?.mediaEmbed
          ? 'flex items-center justify-center'
          : 'm-auto',
        description: 'sr-only',
      }"
    >
      <template #body>
        <MediaVideo v-if="activeMedia?.mediaEmbed" :item="activeMedia" />
        <MediaImage v-else-if="activeMedia?.src" :item="activeMedia" />
      </template>
    </UModal>
  </div>
</template>
