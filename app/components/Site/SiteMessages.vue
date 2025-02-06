<script setup lang="ts">
const { getMessages } = useDrupalCe()
const toast = useToast()

onMounted(() => {
  const freshMessages = getMessages().value

  // Show each message as a toast
  freshMessages.forEach((message) => {
    toast.add({
      title: message.type === 'success' ? 'Success!' : 'Error!',
      description: createVNodeFromHTML(message.message),
      icon: getAlertIcon(message.type),
      color: message.type === 'success' ? 'success' : 'error',
    })
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

<template>
  <!-- The toast system is handled globally, so no need to render anything here -->
</template>
