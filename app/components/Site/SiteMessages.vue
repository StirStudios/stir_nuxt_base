<script setup lang="ts">
const { getMessages } = useDrupalCe()
const messages = ref([])

onMounted(() => {
  messages.value = getMessages().value
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

function scheduleDismissal(index: number) {
  setTimeout(() => {
    dismiss(index)
  }, 10000)
}

const dismiss = (messageId: string) => {
  dismissedMessageIds.value.add(messageId)
  messages.value = messages.value.filter((msg) => msg.id !== messageId)
}

watch(
  messages,
  (newMessages) => {
    newMessages.forEach((message) => scheduleDismissal(message.id))
  },
  { immediate: true },
)
</script>

<template>
  <UAlert
    v-for="(message, index) in messages"
    :key="message.id"
    :color="message.type === 'success' ? 'success' : 'error'"
    :title="message.type === 'success' ? 'Success!' : 'Error!'"
    :icon="getAlertIcon(message.type)"
    close
    @update:open="dismiss(message.id)"
  >
    <template #description>
      <div v-html="message.message" />
    </template>
  </UAlert>
</template>
