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
@import '~/assets/css/main.css';

.drupal-form {
  .form-item {
    @apply mb-5;
    label {
      @apply mb-2 block text-sm font-medium text-(--ui-text);
    }
    input {
      @apply w-full gap-1.5 rounded-[calc(var(--ui-radius)*1.5)] border-0 bg-(--ui-bg) px-2.5 py-2.5 text-sm text-(--ui-text-highlighted) ring ring-(--ui-border-accented) transition-colors ring-inset placeholder:text-(--ui-text-dimmed) focus:outline-none focus-visible:ring-2 focus-visible:ring-(--ui-primary) focus-visible:ring-inset disabled:cursor-not-allowed disabled:opacity-75;
    }
  }
  .form-actions {
    input {
      @apply flex w-full justify-center gap-1.5 rounded-[calc(var(--ui-radius)*1.5)] bg-(--ui-primary) px-3.5 py-2.5 text-sm font-medium text-(--ui-bg) transition-colors hover:bg-(--ui-primary)/75 focus:outline-hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--ui-primary) disabled:cursor-not-allowed disabled:bg-(--ui-primary) disabled:opacity-75 aria-disabled:cursor-not-allowed aria-disabled:bg-(--ui-primary) aria-disabled:opacity-75;
    }
  }
  .more-links {
    @apply mt-3 block text-sm font-medium text-(--ui-text);
  }
}
</style>
