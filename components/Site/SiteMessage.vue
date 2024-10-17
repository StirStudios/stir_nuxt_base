<script setup lang="ts">
const props = defineProps<{
  type: string
  id: string
  message: string
}>()

const emit = defineEmits(['dismiss'])

onMounted(() => {
  setTimeout(() => dismiss(), 5000)
})

const dismiss = () => emit('dismiss', props.id)
</script>

<template>
  <div :class="['message', type]" @click="dismiss">
    <div v-html="message" />
  </div>
</template>

<style lang="css" scoped>
.message {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  color: white;
  cursor: pointer;
}

.message.error {
  background-color: crimson;
}

.message.success {
  background-color: rebeccapurple;
}
</style>
