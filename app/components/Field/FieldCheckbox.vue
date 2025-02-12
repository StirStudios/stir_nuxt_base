<script setup lang="ts">
import type { WebformFieldProps } from '~/types/formTypes'
import { cleanHTML } from '~/utils/cleanHTML'

const props = defineProps<{
  field: WebformFieldProps
  fieldName: string
  state: Record<string, boolean | string>
}>()

const descriptionContent = shallowRef<string>('')
const checkboxValue = ref<boolean>(props.field['#defaultValue'] ?? false)

onMounted(() => {
  descriptionContent.value = cleanHTML(props.field['#description'] || '')

  // Ensure state is initialized properly
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
    <template #description>
      <span v-html="descriptionContent" />
    </template>
  </UCheckbox>
</template>
