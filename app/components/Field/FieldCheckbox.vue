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
const optionProps = props.field['#optionProperties'] || {}

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
    class="form-input w-full"
    :label="field['#title']"
    :ui="{
      label: descriptionContent ? 'sr-only' : '',
    }"
    @update:model-value="state[fieldName] = $event"
  >
    <template #label>
      <span>{{ field['#title'] }}</span>
      <span v-if="optionProps.description">{{ optionProps.description }}</span>
      <span v-if="optionProps.price" class="extra">
        ${{ optionProps.price.toLocaleString() }}
      </span>
    </template>

    <template #description>
      <span v-html="descriptionContent" />
    </template>
  </UCheckbox>
</template>
