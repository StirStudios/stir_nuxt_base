<script setup lang="ts">
const props = defineProps<{
  id?: number | string
  uuid?: string
  parentUuid?: string
  region?: string

  link?: {
    element?: string
    title?: string
    url?: string
    external?: boolean
  }
  color?: string
  size?: string
  variant?: string
  icon?: string
  block?: boolean
  align?: string
  spacing?: string
  width?: string
  editLink?: string
}>()

const open = ref(false)
const theme = useAppConfig().stirTheme

const linkData = computed(() => props.link || {})
const hasLink = computed(() => !!linkData.value.url)
const isExternal = computed(() => !!linkData.value.external)
const btnLabel = computed(() => linkData.value.title || 'View link')
const btnColor = computed(() => props.color || 'primary')
const btnVariant = computed(() => props.variant || 'solid')
const btnSize = computed(() => props.size || 'xl')
const btnBlock = computed(() => props.block ?? false)
const iconName = computed(() => props.icon || null)

const pdf = computed(
  () => props.media?.find((m) => m.type === 'document') || null,
)
const hasPdf = computed(() => !!pdf.value?.url)
</script>

<template>
  <EditLink :link="props.editLink">
    <div :class="['flex w-full', props.align, props.spacing, props.width]">
      <UButton
        v-if="hasPdf"
        :block="btnBlock"
        class="mt-4"
        :color="btnColor"
        :icon="iconName ?? 'i-lucide-file-text'"
        :label="pdf.title || btnLabel"
        :size="btnSize"
        :variant="btnVariant"
        @click="open = true"
      />

      <UButton
        v-else-if="hasLink"
        :block="btnBlock"
        class="mt-4"
        :color="btnColor"
        :icon="iconName"
        :label="btnLabel"
        :size="btnSize"
        :target="isExternal ? '_blank' : undefined"
        :to="linkData.url"
        :variant="btnVariant"
      />
    </div>
  </EditLink>

  <UModal
    v-if="hasPdf && theme.pdf"
    v-model:open="open"
    :description="pdf.alt"
    fullscreen
    :title="pdf.title || btnLabel"
  >
    <template #body>
      <PdfViewer :src="pdf.url" />
    </template>
  </UModal>
</template>
