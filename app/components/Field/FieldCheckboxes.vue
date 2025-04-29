<script setup lang="ts">
import type { WebformFieldProps, WebformState } from '~/types/formTypes'
import { cleanHTML } from '~/utils/cleanHTML'

const props = defineProps<{
  field: WebformFieldProps
  fieldName: string
  state: WebformState
}>()

const descriptionContent = shallowRef<string>('')

onMounted(() => {
  const value = props.state[props.fieldName]

  if (value === undefined || value === '') {
    props.state[props.fieldName] = []
  }

  descriptionContent.value = cleanHTML(props.field['#description'] || '')
})

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
    v-model="state[fieldName]"
    class="form-input w-full"
    :items="items"
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
  </UCheckboxGroup>
</template>
