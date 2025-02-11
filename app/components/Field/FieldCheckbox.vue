<script setup lang="ts">
import type { WebformFieldProps } from '~/types/formTypes'
import { cleanHTML } from '~/utils/cleanHTML'

const props = defineProps<{
  field: WebformFieldProps
  fieldName: string
  state: Record<string, boolean | string>
}>()

const descriptionContent = computed(() => props.field['#description'] || '')
const checkboxValue = ref<boolean>(props.field['#defaultValue'] ?? false)

onMounted(() => {
  // Initialize parent state only if it's empty or undefined
  if (props.state[props.fieldName] === undefined) {
    props.state[props.fieldName] = checkboxValue.value
  }
})
</script>

<template>
  <UCheckbox
    v-model="checkboxValue"
    class="w-full"
    @update:model-value="props.state[fieldName] = $event"
  >
    <template v-if="descriptionContent" #description>
      <div v-html="cleanHTML(descriptionContent)" />
    </template>
  </UCheckbox>
</template>
