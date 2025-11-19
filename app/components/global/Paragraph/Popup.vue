<script setup lang="ts">
defineOptions({ inheritAttrs: false })

const props = defineProps<{
  id?: number | string
  uuid?: string
  parentUuid?: string
  region?: string

  text?: string
  direction?: string
  editLink?: string
  webform?: any

  onClose?: () => void
}>()

const slots = useSlots()
</script>

<template>
  <EditLink :link="props.editLink">
    <div class="space-y-6 p-5">
      <slot name="media" />

      <div v-if="props.text" v-html="props.text" />

      <ParagraphWebform
        v-if="props.webform"
        :on-close="props.onClose"
        :webform="props.webform"
      />
    </div>
  </EditLink>
</template>
