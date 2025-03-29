<script setup lang="ts">
import type { MediaSettings, MediaProps } from '~/types/MediaTypes'

const appConfig = useAppConfig()

defineProps<{
  item: {
    settings: MediaSettings
    media: MediaProps[]
  }
}>()
</script>

<template>
  <EditLink :link="item.editLink">
    <WrapAlign :align="item.align">
      <WrapGrid
        :header="item.header"
        :classes="
          [item.gridItems, item.width, item.spacing].filter(Boolean).join(' ')
        "
      >
        <WrapAnimate
          v-for="media in item.media"
          :effect="item.direction"
          :key="media.mid"
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
        </WrapAnimate>
      </WrapGrid>
    </WrapAlign>
  </EditLink>
</template>
