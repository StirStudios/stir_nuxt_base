<script lang="ts" setup>
import type { IconsSocialProps } from '~/types'

const props = defineProps<IconsSocialProps>()

const activeClass = props.activeClass ?? 'text-primary'
const inactiveClass =
  props.inactiveClass ?? 'text-black dark:text-white hover:text-primary-400'
const iconSize = props.iconSize ?? 'size-10'
</script>

<template>
  <UTooltip :text="title">
    <ULink
      :active-class="activeClass"
      :inactive-class="inactiveClass"
      rel="noopener"
      target="_blank"
      :to="url"
    >
      <UIcon
        :aria-description="tooltip"
        aria-hidden="true"
        :aria-label="title + ' Icon'"
        :class="['mx-1', iconSize]"
        :name="icon"
      />
      <span class="sr-only">{{ tooltip }}</span>
    </ULink>
  </UTooltip>
</template>
