<script setup lang="ts">
const { getMessages } = useDrupalCe()
const messages = getMessages()

const dismiss = (index: number) => messages.value.splice(index, 1)

function getAlertTitle(type: string): string {
  switch (type) {
    case 'success':
      return 'Success!'
    case 'error':
      return 'Error!'
    case 'warning':
      return 'Warning!'
    case 'info':
      return 'Information'
    default:
      return 'Notice'
  }
}

function getAlertIcon(type: string): string {
  switch (type) {
    case 'success':
      return 'i-lucide-check-circle'
    case 'error':
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

<template>
  <div class="alerts">
    <UAlert
      v-for="(message, index) in messages"
      :key="`${index}-${message.message}`"
      :color="message.type || 'neutral'"
      :title="getAlertTitle(message.type)"
      :icon="getAlertIcon(message.type)"
      close
      @update:open="dismiss(index)"
    >
      <template #description>
        <SiteMessage :type="message.type" :message="message.message" />
      </template>
    </UAlert>
  </div>
</template>
