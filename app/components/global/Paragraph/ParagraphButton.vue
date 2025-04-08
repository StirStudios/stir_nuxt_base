<script setup lang="ts">
import type { RegionItemProps } from '~/types/ContentTypes'

const props = defineProps<{
  item: RegionItemProps
}>()

const open = ref(false)

const pdf = computed(
  () => props.item.media?.find((m) => m.type === 'document') || null,
)

const buttonLabel = computed(
  () => pdf.value?.title || props.item.title || 'View PDF',
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
        @click="open = true"
      />
    </div>
  </EditLink>

  <UModal
    v-model:open="open"
    :description="pdf?.title"
    fullscreen
    :title="pdf.title"
  >
    <template #body>
      <PdfViewer class="max-w-2xl" :src="pdf.url" />
    </template>
  </UModal>
</template>
