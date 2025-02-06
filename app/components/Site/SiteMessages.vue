<script setup lang="ts">
const { getMessages } = useDrupalCe()
const toast = useToast()

// Track shown messages globally
const shownMessageIds = useState('shownMessageIds', () => new Set<string>())

onMounted(() => {
  const freshMessages = getMessages().value

  // Show each message only if it hasn't been shown before
  freshMessages.forEach((message) => {
    if (!shownMessageIds.value.has(message.id)) {
      // Mark the message as shown
      shownMessageIds.value.add(message.id)

      // Display the toast
      toast.add({
        title: message.type === 'success' ? 'Success!' : 'Error!',
        description: createVNodeFromHTML(message.message),
        icon: getAlertIcon(message.type),
        color: message.type === 'success' ? 'success' : 'error',
      })
    }
  })
})

// Utility function to convert HTML strings into VNodes
function createVNodeFromHTML(html: string) {
  return h('div', { innerHTML: html })
}

// Determine the icon based on message type
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

<template></template>
