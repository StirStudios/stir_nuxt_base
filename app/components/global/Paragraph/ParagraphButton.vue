<script setup lang="ts">
import type { RegionItemProps } from '~/types/ContentTypes'

const props = defineProps<{
  item: RegionItemProps
}>()

const open = ref(false)
const appConfig = useAppConfig()

const PdfViewer = computed(() => {
  if (!appConfig.stirTheme?.pdf) return null

  try {
    const comp = resolveComponent('PdfViewer')
    return markRaw(comp)
  } catch (err) {
    console.warn('PdfViewer not available:', err)
    return null
  }
})

// Prefer PDF media if available, otherwise fallback to first link
const pdf = computed(
  () => props.item.media?.find((m) => m.type === 'document') || null,
)
const link = computed(() =>
  pdf.value?.url ? null : props.item.link?.[0] || null,
)
const buttonLabel = computed(
  () => pdf.value?.title || link.value?.title || props.item.title || 'View PDF',
)
</script>

<template>
  <EditLink :link="item.editLink">
    <div :class="['flex w-full', item.align, item.spacing, item.width]">
      <UButton
        v-if="pdf?.url"
        class="mt-4"
        icon="i-lucide-file-text"
        :label="buttonLabel"
        :title="buttonLabel"
        @click="open = true"
      />

      <UButton
        v-else-if="link?.uri"
        class="mt-4"
        :label="buttonLabel"
        target="_blank"
        :title="buttonLabel"
        :to="link.uri"
      />
    </div>
  </EditLink>

  <UModal
    v-if="PdfViewer && pdf?.url"
    v-model:open="open"
    :description="pdf.alt"
    fullscreen
    :title="pdf.title || props.item.title"
  >
    <template #body>
      <component :is="PdfViewer" :src="pdf.url" />
    </template>
  </UModal>
</template>
