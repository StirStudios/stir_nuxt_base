<script setup lang="ts">
defineProps(['error'])
const clearHome = () => clearError({ redirect: '/' })
useHead({
  title: 'Ooops',
})
</script>

<template>
  <section class="bg-gray-50 p-10 dark:bg-gray-900">
    <div
      class="mx-auto flex flex-col items-center justify-center py-8 md:h-screen lg:py-0"
    >
      <UIcon class="mb-10 size-20" name="i-heroicons-bolt" />
      <h1>{{ error.statusCode }}</h1>
      <p>{{ error.message }}</p>
      <UButton
        class="mt-5"
        color="primary"
        label="Take me back home"
        @click="clearHome"
      />
    </div>
  </section>
</template>
