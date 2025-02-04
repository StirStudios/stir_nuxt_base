<script setup lang="ts">
const { getMessages } = useDrupalCe()

const messages = useState('messages', () => [])
const dismissedMessageIds = useState(
  'dismissedMessageIds',
  () => new Set<string>(),
)

onMounted(() => {
  const freshMessages = getMessages().value
  messages.value = freshMessages.filter(
    (msg) => !dismissedMessageIds.value.has(msg.id),
  )
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

function scheduleDismissal(messageId: string) {
  setTimeout(() => dismiss(messageId), 5000)
}

const dismiss = (messageId: string) => {
  dismissedMessageIds.value.add(messageId)
  messages.value = messages.value.filter((msg) => msg.id !== messageId)
}

watch(
  messages,
  (newMessages) => {
    newMessages.forEach((message) => {
      if (!dismissedMessageIds.value.has(message.id)) {
        scheduleDismissal(message.id)
      }
    })
  },
  { immediate: true },
)
</script>

<template>
  <UAlert
    v-for="message in messages"
    :key="message.id"
    :color="message.type === 'success' ? 'green' : 'red'"
    :title="message.type === 'success' ? 'Success!' : 'Error!'"
  >
    <template #icon="{ icon }">
      <UIcon :name="getAlertIcon(message.type)" />
    </template>
    <template #description>
      <div v-html="message.message" />
    </template>
  </UAlert>
</template>

<style scoped lang="css">
p {
  @apply mt-0;
}
</style>
