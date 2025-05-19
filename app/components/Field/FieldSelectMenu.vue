<script setup lang="ts">
import type { WebformFieldProps } from '~/types/formTypes'
import { transformOptions } from '~/utils/transformUtils'

const { webform } = useAppConfig().stirTheme

const props = defineProps<{
  field: WebformFieldProps
  fieldName: string
  state: Record<string, string>
}>()

onMounted(() => {
  if (props.state[props.fieldName] === undefined) {
    props.state[props.fieldName] = ''
  }
})
</script>

<template>
  <USelectMenu
    v-model="state[fieldName]"
    class="w-full"
    :items="transformOptions(field['#options'] || {})"
    placeholder="Select"
    :variant="webform.variant"
  />
</template>
