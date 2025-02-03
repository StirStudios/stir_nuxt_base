<script setup lang="ts">
const { getMessages } = useDrupalCe()
const messages = getMessages()

const dismiss = (index: number) => messages.value.splice(index, 1)
</script>

<template>
  <div class="alerts">
    <UAlert
      v-for="(message, index) in messages"
      :key="`${index}-${message.message}`"
      :color="message.type || 'neutral'"
      :title="getAlertTitle(message.type)"
      icon="i-lucide-info"
      variant="outline"
      close
      @update:open="dismiss(index)"
    >
      <template #description>
        <div v-html="message.message" />
      </template>
    </UAlert>
  </div>
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
