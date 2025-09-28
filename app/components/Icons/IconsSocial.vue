<script lang="ts" setup>
import type { IconsSocialProps } from '~/types/LinkTypes'

const props = defineProps<IconsSocialProps>()

const activeClass = props.activeClass ?? 'text-primary'
const inactiveClass =
  props.inactiveClass ?? 'text-black dark:text-white hover:text-primary-400'
const iconSize = props.iconSize ?? 'size-10'
</script>

<template>
  <ULink
    :active-class="activeClass"
    :aria-label="`Visit our ${title} page`"
    :inactive-class="inactiveClass"
    rel="noopener"
    target="_blank"
    :to="url"
  >
    <UIcon aria-hidden="true" :class="['mx-1', iconSize]" :name="icon" />
  </ULink>
</template>
