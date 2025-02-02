<script setup lang="ts">
const { getMessages } = useDrupalCe()
const toast = useToast()
const messages = getMessages()

// Watch for new messages and trigger a toast for each
watch(
  messages,
  (newMessages) => {
    newMessages.forEach((message, index) => {
      toast.add({
        title: getToastTitle(message.type),
        color: getToastColor(message.type),
        icon: getToastIcon(message.type),
        close: true,
        duration: 5000,
        slots: {
          description: () =>
            h('div', {
              innerHTML: message.message, // Dynamically render raw HTML
            }),
        },
        onDismiss: () => messages.value.splice(index, 1),
      })
    })
  },
  { deep: true, immediate: true },
)

function getToastTitle(type: string): string {
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

function getToastColor(type: string): string {
  switch (type) {
    case 'success':
      return 'success'
    case 'error':
    case 'danger':
      return 'error'
    case 'warning':
      return 'warning'
    case 'info':
      return 'info'
    default:
      return 'neutral'
  }
}

function getToastIcon(type: string): string {
  switch (type) {
    case 'success':
      return 'i-lucide-check-circle'
    case 'error':
    case 'danger':
      return 'i-lucide-x-circle'
    case 'warning':
      return 'i-lucide-alert-circle'
    case 'info':
      return 'i-lucide-info'
    default:
      return 'i-lucide-bell'
  }
}
</script>

<template></template>
