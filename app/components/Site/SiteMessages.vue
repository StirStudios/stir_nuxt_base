<script setup lang="ts">
import { ref, onMounted, watchEffect } from 'vue'
const toast = useToast()
const { getMessages } = useDrupalCe()

// State to track already shown messages
const shownMessages = ref(new Set<string>())

onMounted(() => {
  const messages = getMessages().value

  messages.forEach((message) => {
    // Check if the message has already been shown
    if (!shownMessages.value.has(message.message)) {
      // Show the toast
      toast.add({
        title: message.type === 'success' ? 'Success!' : 'Error!',
        description: h('div', { innerHTML: message.message }),
        icon: getAlertIcon(message.type),
        color: message.type === 'success' ? 'success' : 'error',
      })

      // Track the shown message
      shownMessages.value.add(message.message)
    }
  })
})

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
  <ClientOnly />
</template>
