<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { useAppConfig } from '#imports'

const props = defineProps<{
  modalTitle?: string
}>()

const appConfig = useAppConfig()
const { modal, media } = appConfig.stirTheme

// Local state for modal
const isOpen = ref(false)
const activeSrc = ref<string | null>(null)
const activeAlt = ref<string | null>(null)

// Open modal on click (delegated)
const open = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  const img = target.closest('img')
  if (!img) return

  activeSrc.value = img.getAttribute('src') || ''
  activeAlt.value = img.getAttribute('alt') || ''
  isOpen.value = true
}

const close = () => {
  isOpen.value = false
  activeSrc.value = null
}

onMounted(() => {
  // Attach delegated click handler to any image inside the slot
  nextTick(() => {
    const container = document.querySelector('[data-media-popup]')
    if (container) {
      container.addEventListener('click', open)
    }
  })
})
</script>

<template>
  <div class="relative" data-media-popup>
    <slot name="media" />
  </div>

  <UModal
    v-model:open="isOpen"
    :title="props.modalTitle || 'Media Viewer'"
    :ui="{
      header: modal.header,
      content: 'max-w-5xl ring-0',
      body: '!p-0 bg-transparent',
    }"
  >
    <template #body>
      <div class="relative flex items-center justify-center bg-black p-4">
        <img
          v-if="activeSrc"
          :alt="activeAlt || ''"
          class="max-h-[80vh] object-contain"
          :src="activeSrc"
        />
      </div>
    </template>
  </UModal>
</template>

<style scoped>
[data-media-popup] img {
  cursor: zoom-in;
  transition: opacity 0.3s;
}
[data-media-popup] img:hover {
  opacity: 0.9;
}
</style>
