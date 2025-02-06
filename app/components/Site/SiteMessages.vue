<script setup lang="ts">
const { getMessages } = useDrupalCe()

// Directly fetch messages
const messages = ref(getMessages().value)

// Function to return the correct icon based on the message type
function getAlertIcon(type: string): string {
  switch (type) {
    case 'success':
      return 'i-lucide-check-circle'
    case 'error':
    case 'danger':
      return 'i-lucide-x-circle'
    default:
      return 'i-lucide-info'
  }
}
</script>

<template>
  <Toast
    v-for="message in messages"
    :key="message.id"
    :color="message.type === 'success' ? 'success' : 'error'"
    :icon="getAlertIcon(message.type)"
    :title="
      () =>
        h('div', [
          h('strong', message.type === 'success' ? 'Success!' : 'Error!'),
        ])
    "
    :description="() => h('div', { innerHTML: message.message })"
    close
  />
</template>
