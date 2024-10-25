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
    class="absolute right-2 top-2 z-50 rounded opacity-0 transition-opacity duration-300 group-hover:opacity-100"
    icon="i-heroicons-pencil-square"
    v-if="link"
    :to="link"
    size="sm"
  />
</template>
