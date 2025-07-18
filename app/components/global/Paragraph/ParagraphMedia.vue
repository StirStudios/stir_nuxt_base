<script setup lang="ts">
import type { MediaSettings, MediaProps } from '~/types/MediaTypes'
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'

const props = defineProps<{
  item: {
    settings: MediaSettings
    media: MediaProps[]
  }
}>()

const item = props.item
const theme = useAppConfig().stirTheme
const breakpoints = useBreakpoints(breakpointsTailwind)
const isOverlay = item.overlay === true

const isMatrixLayout = computed(() =>
  item.gridItems
    ?.split(/\s+/)
    .some((cls) => cls.startsWith('columns-') || cls.includes(':columns-')),
)

const columnCount = computed(() => {
  if (!isMatrixLayout.value) return 1

  const map: Record<string, number> = {}
  item.gridItems?.split(/\s+/).forEach((cls) => {
    const match = cls.match(/(?:(\w+):)?columns-(\d+)/)
    if (match) map[match[1] || 'base'] = parseInt(match[2])
  })

  if (breakpoints.greaterOrEqual('2xl').value && map['2xl']) return map['2xl']
  if (breakpoints.greaterOrEqual('xl').value && map['xl']) return map['xl']
  if (breakpoints.greaterOrEqual('lg').value && map['lg']) return map['lg']
  if (breakpoints.greaterOrEqual('md').value && map['md']) return map['md']
  if (breakpoints.greaterOrEqual('sm').value && map['sm']) return map['sm']
  return map['base'] || 1
})

const mediaOrdered = computed(() => {
  if (!isMatrixLayout.value) return item.media

  const buckets = Array.from({ length: columnCount.value }, () => [])
  item.media.forEach((m, i) => buckets[i % columnCount.value].push(m))
  return buckets.flat()
})
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
            :media="mediaOrdered"
          />
        </WrapAnimate>

        <WrapAnimate
          v-for="media in mediaOrdered"
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
            <template v-if="mediaOrdered.find((m) => m.type === 'link')">
              <ULink
                target="_blank"
                :to="mediaOrdered.find((m) => m.type === 'link')?.url"
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
