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
  <EditLink :link="item.editLink">
    <WrapGrid :header="item.header" :wrapper="item.grid">
      <div
        v-for="media in item.media"
        :key="media.mid"
        :class="'media media-' + media.mid"
      >
        <WrapAnimate :effect="item.direction" :animate="item.animate">
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
        </WrapAnimate>
      </div>
    </WrapGrid>
  </EditLink>
</template>
