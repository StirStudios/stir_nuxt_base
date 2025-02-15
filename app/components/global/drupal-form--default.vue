<script setup lang="ts">
defineProps<{
  formId: string
  attributes: object
  method: string
}>()
defineSlots<{
  default()
}>()
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
        <slot>
          <component :is="useDrupalCe().renderCustomElements($attrs.content)" />
        </slot>
      </form>
    </div>
  </div>
</template>
