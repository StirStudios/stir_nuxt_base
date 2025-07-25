<script setup lang="ts">
import type { RegionItemProps } from '~/types/ContentTypes'

const props = defineProps<{
  item: RegionItemProps
}>()

const open = ref(false)
const theme = useAppConfig().stirTheme

// Prefer PDF media if available, otherwise fallback to first link
const pdf = computed(
  () => props.item.media?.find((m) => m.type === 'document') || null,
)

const link = computed(() => (pdf.value?.url ? null : props.item.link || null))

const pdfLabel = computed(
  () => pdf.value?.title || props.item.title || 'View PDF',
)

const linkLabel = computed(
  () => link.value?.title || props.item.title || 'View link',
)
</script>

<template>
  <EditLink :link="item.editLink">
    <div :class="['flex w-full', item.align, item.spacing, item.width]">
      <UButton
        v-if="pdf?.url"
        class="mt-4"
        icon="i-lucide-file-text"
        :label="pdfLabel"
        :title="pdfLabel"
        @click="open = true"
      />

      <UButton
        v-else-if="link?.url"
        class="mt-4"
        :label="linkLabel"
        target="_blank"
        :title="linkLabel"
        :to="link.url"
      />
    </div>
  </EditLink>

  <UModal
    v-if="pdf?.url && theme.pdf"
    v-model:open="open"
    :description="pdf.alt"
    fullscreen
    :title="pdf.title || props.item.title"
  >
    <template #body>
      <PdfViewer :src="pdf.url" />
    </template>
  </UModal>
</template>
