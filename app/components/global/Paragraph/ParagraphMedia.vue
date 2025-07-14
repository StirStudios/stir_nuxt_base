<script setup lang="ts">
import type { MediaSettings, MediaProps } from '~/types/MediaTypes'

const props = defineProps<{
  item: {
    settings: MediaSettings
    media: MediaProps[]
  }
}>()

const item = props.item
const theme = useAppConfig().stirTheme
const isOverlay = item.overlay === true
</script>

<template>
  <EditLink :link="item.editLink">
    <WrapAlign :align="item.align">
      <WrapGrid
        :classes="
          isOverlay
            ? ''
            : [item.gridItems, item.width, item.spacing]
                .filter(Boolean)
                .join(' ')
        "
        :header="item.header"
      >
        <WrapAnimate v-if="isOverlay" :key="item.mid" :effect="item.direction">
          <MediaPopup
            :grid="
              [item.gridItems, item.width, item.spacing]
                .filter(Boolean)
                .join(' ')
            "
            :media="item.media"
          />
        </WrapAnimate>

        <WrapAnimate
          v-for="media in item.media"
          v-else
          :key="media.mid"
          :effect="item.direction"
        >
          <template v-if="media.type === 'audio'">
            <div v-html="media.mediaEmbed" />
          </template>

          <template v-else-if="media.type === 'document' && theme.pdf">
            <PdfViewer :src="media.url" />
          </template>

          <template v-else-if="media.type === 'image'">
            <template v-if="item.media.find((m) => m.type === 'link')">
              <ULink
                target="_blank"
                :to="item.media.find((m) => m.type === 'link')?.url"
              >
                <MediaSimple :media="[media]" />
              </ULink>
            </template>
            <template v-else>
              <MediaSimple :media="[media]" />
            </template>
          </template>

          <template v-else-if="media.type !== 'link'">
            <MediaSimple :media="[media]" />
          </template>
        </WrapAnimate>
      </WrapGrid>
    </WrapAlign>
  </EditLink>
</template>
