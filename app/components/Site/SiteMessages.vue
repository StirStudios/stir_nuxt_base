<script setup lang="ts">
const { getMessages } = useDrupalCe()
const messages = getMessages()

// Map icons based on message type
function getAlertIcon(type: string): string {
  switch (type) {
    case 'success':
      return 'i-lucide-check-circle' // Success icon
    case 'error':
    case 'danger':
      return 'i-lucide-x-circle' // Error icon
    default:
      return 'i-lucide-info' // Default icon for other types
  }
}

// Dismiss function to remove alerts
const dismiss = (index: number) => messages.value.splice(index, 1)
</script>

<template>
  <div class="max-w-[var(--ui-container)">
    <UAlert
      v-for="(message, index) in messages"
      :key="`${index}-${message.message}`"
      :color="message.type === 'success' ? 'success' : 'error'"
      :title="message.type === 'success' ? 'Success!' : 'Error!'"
      :icon="getAlertIcon(message.type)"
      close
      duration="5000"
      @update:open="dismiss(index)"
    >
      <template #description>
        <div v-html="message.message" />
      </template>
    </UAlert>
  </div>
</template>
