<script setup lang="ts">
import type { DrupalFormProps } from '~/types/FormTypes'

defineProps<DrupalFormProps>()
</script>

<template>
  <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form
        :formId="formId"
        :method="method"
        v-bind="attributes"
        :action="useRoute().fullPath"
        class="drupal-form"
      >
        <slot><div v-html="content" class="space-y-6" /></slot>
      </form>
    </div>
  </div>
</template>

<style lang="css">
@import 'tailwindcss';
@import '@nuxt/ui';
.drupal-form {
  .form-item {
    label {
      @apply block text-sm leading-6 font-medium text-white;
    }
    input {
      @apply mt-2 block w-full rounded-md border-0 px-2 py-1.5 text-white ring-1 shadow-sm ring-gray-300 ring-inset placeholder:text-white focus:ring-2 focus:ring-indigo-600 focus:ring-inset sm:text-sm sm:leading-6;
    }
  }
  .form-actions {
    input {
      @apply bg-primary hover:bg-primary-500 focus-visible:outline-primary-600 flex w-full justify-center rounded-md px-3 py-1.5 text-sm leading-6 font-semibold text-black shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2;
    }
  }
}
</style>
