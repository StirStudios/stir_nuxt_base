<script setup lang="ts">
import type { WebformFieldProps } from '~/types'

defineProps<{
  field: WebformFieldProps
  fieldName: string
  state: Record<string, string | number>
  floatingLabel?: boolean
}>()

const { webform } = useAppConfig().stirTheme
const isMaterial = computed(() => webform.variant === 'material')
</script>

<template>
  <UTextarea
    :id="fieldName"
    v-model="state[fieldName]"
    autoresize
    class="w-full"
    placeholder=" "
    :rows="1"
    :ui="floatingLabel ? { base: 'peer' } : {}"
    :variant="webform.variant"
  >
    <label
      v-if="floatingLabel"
      :class="[isMaterial ? '' : 'px-1.5', webform.labels.base]"
      :for="fieldName"
    >
      <span :class="[isMaterial ? '' : 'px-1', 'bg-default inline-flex']">
        {{ field['#title'] }}
      </span>
    </label>
  </UTextarea>
</template>
