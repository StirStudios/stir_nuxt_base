<script lang="ts" setup>
import type { MediaProps } from '~/types/MediaTypes'
import { aspectRatios } from '~/utils/aspectRatios'

const {
  media: { rounded },
  modal: { header },
} = useAppConfig().stirTheme

defineProps<{
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
      :class="[rounded, 'overflow-hidden']"
    >
      <div
        :class="[
          'group relative transform-gpu overflow-hidden transition-all duration-500 ease-in-out will-change-transform hover:scale-110',
          aspectRatios(item.width, item.height),
        ]"
      >
        <MediaImage v-if="item.srcset" :item="item" />
        <div
          v-if="item.mediaEmbed"
          class="absolute inset-0 z-10 bg-black opacity-30 transition-opacity duration-300 group-hover:opacity-10"
        />
        <button
          aria-label="Play Video"
          class="absolute inset-0 z-20 flex cursor-pointer items-center justify-center text-white transition-transform duration-500 ease-in-out hover:scale-125 hover:drop-shadow-md"
          @click="openModal(item)"
        >
          <UIcon
            v-if="item.mediaEmbed"
            aria-hidden="true"
            color="white"
            name="i-heroicons-play-circle"
            size="60"
          />
          <span class="sr-only">Play Video</span>
        </button>
      </div>
    </div>
    <UModal
      v-if="activeMedia"
      v-model:open="modal"
      :description="activeMedia?.alt"
      :title="activeMedia?.alt"
      :ui="{
        header: header
          ? 'flex items-center gap-1.5 p-4 sm:px-6 min-h-16'
          : 'sr-only',
        content: 'max-w-5xl ring-0',
        body: header
          ? activeMedia?.mediaEmbed
            ? 'flex items-center justify-center'
            : 'm-auto'
          : '!p-0 bg-transparent',
        title: 'text-(--ui-text-highlighted) font-semibold text-xl mb-0',
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
