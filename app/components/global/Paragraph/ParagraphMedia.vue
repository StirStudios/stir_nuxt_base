<script setup lang="ts">
import type { MediaSettings, MediaProps } from '~/types/MediaTypes'

defineProps<{
  item: {
    settings: MediaSettings
    media: MediaProps[]
  }
}>()
</script>

<template>
  <WrapNone :wrapper="item.editLink ? 'div' : undefined">
    <EditLink :link="item.editLink" />
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
              item.overlay === true ||
              (media.type === 'video' && media.type === 'image')
            "
          >
            <MediaPopup :media="[media]" />
          </template>
          <template v-else-if="media.type === 'audio'">
            <div v-html="media.mediaEmbed" />
          </template>
          <template v-else>
            <MediaSimple :media="[media]" />
          </template>
        </div>
      </WrapGrid>
    </WrapAnimate>
  </WrapNone>
</template>
