<script setup lang="ts">
const { getMessages } = useDrupalCe()
const toast = useToast()

if (process.client) {
  onMounted(() => {
    const messages = getMessages().value

    messages.forEach((message) => {
      toast.add({
        title: message.type === 'success' ? 'Success!' : 'Error!',
        description: h('div', { innerHTML: message.message }),
        icon: getAlertIcon(message.type),
        color: message.type === 'success' ? 'success' : 'error',
      })
    })
  })
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
