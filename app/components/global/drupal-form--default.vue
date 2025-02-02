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
