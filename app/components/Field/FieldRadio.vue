<script setup lang="ts">
import type { WebformFieldProps } from '~/types/formTypes'
import { transformOptions } from '~/utils/transformOptions'

const props = defineProps<{
  field: WebformFieldProps
  fieldName: string
  state: Record<string, any>
}>()

const transformedOptions = computed(() =>
  transformOptions(props.field['#options'] || {}),
)

onMounted(() => {
  if (props.state[props.fieldName] === undefined) {
    props.state[props.fieldName] = ''
  }
})
</script>

<template>
  <URadioGroup
    v-model="state[fieldName]"
    :items="transformedOptions"
    orientation="horizontal"
    class="w-full"
  >
    <template #description="{ item }">
      <span class="mt-2 block whitespace-pre-line">{{ item.description }}</span>
    </template>
  </URadioGroup>
</template>
