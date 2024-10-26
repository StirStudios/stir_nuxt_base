<script setup lang="ts">
import type { FormProps } from '~/types'

const props = defineProps<FormProps>()
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
.drupal-form {
  .form-item {
    label {
      @apply block text-sm font-medium leading-6 text-white;
    }
    input {
      @apply mt-2 block w-full rounded-md border-0 px-2 py-1.5 text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-white focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6;
    }
  }
  .form-actions {
    input {
      @apply bg-primary hover:bg-primary-500 focus-visible:outline-primary-600 flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-black shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2;
    }
  }
}
</style>
