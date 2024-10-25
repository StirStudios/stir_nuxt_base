<script setup>
defineProps({
  link: {
    type: String,
    required: false,
  },
})
</script>

<template>
  <UButton
    class="absolute right-0 top-0 z-50 rounded-bl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
    icon="i-heroicons-pencil-square"
    v-if="link"
    :to="link"
    size="sm"
  />
</template>
