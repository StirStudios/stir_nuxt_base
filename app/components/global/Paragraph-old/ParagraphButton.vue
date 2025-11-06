<script setup lang="ts">
import type { RegionItemProps } from '~/types'

const props = defineProps<{
  item: RegionItemProps
}>()

const open = ref(false)
const theme = useAppConfig().stirTheme

const iconName = computed(() => props.item.icon || null)
const btnSize = computed(() => props.item.size || 'xl')
const btnVariant = computed(() => props.item.variant || 'solid')
const btnColor = computed(() => props.item.color || 'primary')
const btnBlock = computed(() => props.item.block ?? false)

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
        :block="btnBlock"
        class="mt-4"
        :color="btnColor"
        :icon="iconName ?? 'i-lucide-file-text'"
        :label="pdfLabel"
        :size="btnSize"
        :variant="btnVariant"
        @click="open = true"
      />

      <UButton
        v-else-if="link?.url"
        :block="btnBlock"
        class="mt-4"
        :color="btnColor"
        :icon="iconName"
        :label="linkLabel"
        :size="btnSize"
        :target="link.external ? '_blank' : undefined"
        :to="link.url"
        :variant="btnVariant"
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
