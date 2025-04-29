<script setup lang="ts">
import type { WebformFieldProps } from '~/types/formTypes'
import { cleanHTML } from '~/utils/cleanHTML'

const props = defineProps<{
  field: WebformFieldProps
  fieldName: string
  state: WebformState
}>()

const descriptionContent = shallowRef<string>('')

const checkboxGroupValue = ref<string[]>(props.field['#defaultValue'] ?? [])

onMounted(() => {
  descriptionContent.value = cleanHTML(props.field['#description'] || '')

  if (props.state[props.fieldName] === undefined) {
    props.state[props.fieldName] = checkboxGroupValue.value
  }
})

// More generic: load all option props
const items = computed(() => {
  const options = props.field['#options'] || {}
  const optionProps = props.field['#optionProperties'] || {}

  return Object.entries(options).map(([key, label]) => ({
    label,
    value: key,
    props: optionProps?.[key] || {},
  }))
})
</script>

<template>
  <UCheckboxGroup
    v-model="checkboxGroupValue"
    class="form-input w-full"
    :items="items"
    :legend="field['#title']"
    :required="field['#required'] || false"
    :ui="{
      legend: 'text-dimmed',
    }"
    @update:model-value="state[fieldName] = $event"
  >
    <template #label="{ item }">
      {{ item.label }}
      <template v-for="(value, key) in item.props" :key="key">
        <span v-if="key === 'price'" class="price">
          ${{ value.toLocaleString() }}
        </span>
        <span v-else class="extra">
          {{ value }}
        </span>
      </template>
    </template>

    <template #description>
      <span v-html="descriptionContent" />
    </template>
  </UCheckboxGroup>
</template>
