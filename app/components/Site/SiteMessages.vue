<script setup lang="ts">
const { getMessages } = useDrupalCe()
const toast = useToast()

onMounted(() => {
  const freshMessages = getMessages().value

  // Show each message as a toast
  freshMessages.forEach((message) => {
    toast.add({
      title: message.type === 'success' ? 'Success!' : 'Error!',
      description: message.message, // HTML support is built-in
      icon: getAlertIcon(message.type),
      color: message.type === 'success' ? 'success' : 'error',
    })
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
  <!-- The toast system is handled globally, so no need to render anything here -->
</template>
