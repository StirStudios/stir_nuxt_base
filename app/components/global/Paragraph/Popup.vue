<script setup lang="ts">
defineProps<{
  /* Identity */
  id?: number | string
  uuid?: string
  parentUuid?: string
  region?: string

  /* Content */
  text?: string
  webform?: unknown

  /* Behaviour */
  direction?: string
  onClose?: () => void

  /* Editor tools */
  editLink?: string
}>()
</script>

<template>
  <EditLink :link="editLink">
    <div class="space-y-6 p-5">
      <slot name="media" />

      <div v-if="text" v-html="text" />

      <ParagraphWebform v-if="webform" :on-close="onClose" :webform="webform" />
    </div>
  </EditLink>
</template>
