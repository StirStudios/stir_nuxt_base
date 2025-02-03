<script setup lang="ts">
const { getMessages } = useDrupalCe()
const messages = getMessages()

const dismiss = (index: number) => messages.value.splice(index, 1)
</script>

<template>
  <UAlert
    v-for="(message, index) in messages"
    :key="`${index}-${message.message}`"
    :color="message.type || 'neutral'"
    :title="getAlertTitle(message.type)"
    :ui="{
      root: 'relative max-w-[var(--ui-container) overflow-hidden w-full rounded-[calc(var(--ui-radius)*2)] p-4 flex gap-2.5',
      icon: 'size-11',
    }"
    ,
    icon="i-lucide-info"
    variant="outline"
    close
    @update:open="dismiss(index)"
  >
    <template #description>
      <div v-html="message.message" />
    </template>
  </UAlert>
</template>

<script lang="ts">
// Utility function for the alert title based on the message type
function getAlertTitle(type: string): string {
  switch (type) {
    case 'success':
      return 'Success!'
    case 'error':
    case 'danger':
      return 'Error!'
    case 'warning':
      return 'Warning!'
    case 'info':
      return 'Information'
    default:
      return 'Notice'
  }
}
</script>
