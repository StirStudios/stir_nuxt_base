<script setup lang="ts">
type IconsSocialProps = {
  title: string
  url: string
  icon: string
  iconSize?: string
  activeClass?: string
  inactiveClass?: string
}

const props = defineProps<IconsSocialProps>()
const iconSize = props.iconSize || 'size-10'
</script>

<template>
  <ULink
    :aria-label="`Visit our ${title} page`"
    inactive-class="transition-colors hover:text-primary"
    raw
    rel="noopener noreferrer"
    target="_blank"
    :to="url"
  >
    <UIcon aria-hidden="true" :class="['mx-1', iconSize]" :name="icon" />
  </ULink>
</template>
