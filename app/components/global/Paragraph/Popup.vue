<script setup lang="ts">
defineProps<{
  id: number | string
  uuid: string
  parentUuid?: string
  region?: string

  text?: string
  alert?: string
  webform?: unknown

  direction?: string
  onClose?: () => void

  editLink?: string
}>()
</script>

<template>
  <EditLink :link="editLink">
    <slot name="media" />
    <slot name="schedule" />

    <div class="space-y-6 p-5">
      <div v-if="text" v-html="text" />
      <ParagraphWebform v-if="webform" :on-close="onClose" :webform="webform" />
    </div>
  </EditLink>
</template>
