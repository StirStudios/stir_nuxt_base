<script setup lang="ts">
import type { MediaSettings, MediaProps } from '~/types/MediaTypes'

defineProps<{
  item: {
    settings: MediaSettings
    media: MediaProps[]
  }
}>()

const appConfig = useAppConfig()

const PdfViewer = computed(() => {
  if (!appConfig.stirTheme?.pdf) return null

  try {
    // Dynamically resolve the component name at runtime
    const comp = resolveComponent('PdfViewer')
    return markRaw(comp)
  } catch (err) {
    console.warn('PdfViewer not available:', err)
    return null
  }
})
</script>

<template>
  <EditLink :link="item.editLink">
    <WrapAlign :align="item.align">
      <WrapGrid
        :classes="
          [item.gridItems, item.width, item.spacing].filter(Boolean).join(' ')
        "
        :header="item.header"
      >
        <WrapAnimate
          v-for="media in item.media"
          :key="media.mid"
          :effect="item.direction"
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

          <template v-else-if="PdfViewer && media.type === 'document'">
            <div class="mx-auto h-[700px] w-full">
              <component :is="PdfViewer" :src="media.url" />
            </div>
          </template>

          <template v-else>
            <MediaSimple :media="[media]" />
          </template>
        </WrapAnimate>
      </WrapGrid>
    </WrapAlign>
  </EditLink>
</template>
