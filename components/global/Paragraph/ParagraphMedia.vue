<script setup lang="ts">
import type { MediaSettings, Media } from '~/base/types'

defineProps<{
  item: {
    settings: MediaSettings
    media: Media[]
  }
}>()
</script>

<template>
  <WrapAnimate
    :aos="item.direction"
    :wrapper="item.animate === true ? 'div' : undefined"
  >
    <WrapGrid
      :header="item.header"
      :wrapper="item.grid === true ? 'div' : undefined"
    >
      <div
        v-for="media in item.media"
        :key="media.mid"
        :class="'media media-' + media.mid"
      >
        <template
          v-if="
            (item.overlay === true && media.type === 'image') ||
            media.type === 'video'
          "
        >
          <MediaPopup :media="[media]" />
        </template>
        <template v-else-if="media.type === 'image'">
          <MediaSimple :media="[media]" />
        </template>
      </div>
    </WrapGrid>
  </WrapAnimate>
</template>
