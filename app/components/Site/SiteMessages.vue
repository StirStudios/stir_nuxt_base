<script setup lang="ts">
const { getMessages } = useDrupalCe()
const messages = getMessages()

// Map icons based on message type
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

// Automatically dismiss the alert after 10 seconds
onMounted(() => {
  messages.value.forEach((_, index) => {
    setTimeout(() => {
      dismiss(index)
    }, 10000)
  })
})

// Dismiss function to remove alerts
const dismiss = (index: number) => messages.value.splice(index, 1)
</script>

<template>
  <UAlert
    v-for="(message, index) in messages"
    :key="`${index}-${message.message}`"
    :color="message.type === 'success' ? 'success' : 'error'"
    :title="message.type === 'success' ? 'Success!' : 'Error!'"
    :icon="getAlertIcon(message.type)"
    close
    @update:open="dismiss(index)"
  >
    <template #description>
      <div v-html="message.message" />
    </template>
  </UAlert>
</template>
