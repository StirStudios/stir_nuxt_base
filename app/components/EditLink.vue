<script setup lang="ts">
const props = defineProps<{
  id?: number | string
  uuid?: string
  link?: string
  parentUuid?: string
  region?: string
}>()

const isExternalLink = computed(() => {
  if (!props.link) return false
  return /^https?:\/\//.test(props.link)
})
</script>

<template>
  <div v-if="props.link" class="group/edit relative">
    <UButton
      aria-label="Edit content"
      class="absolute end-0 top-0 z-100 rounded opacity-0 pointer-events-none transition-opacity duration-300 group-hover/edit:opacity-100 group-hover/edit:pointer-events-auto group-focus-within/edit:opacity-100 group-focus-within/edit:pointer-events-auto focus-visible:opacity-100 focus-visible:pointer-events-auto"
      icon="i-lucide-edit"
      :rel="isExternalLink ? 'noopener noreferrer' : undefined"
      size="xs"
      :target="isExternalLink ? '_blank' : undefined"
      title="Edit content"
      :to="props.link"
    >
      <span class="sr-only">Edit content</span>
    </UButton>
    <slot />
  </div>
  <slot v-else />
</template>
