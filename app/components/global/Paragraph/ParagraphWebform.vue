<script setup lang="ts">
import { evaluateVisibility } from '~/utils/evaluateVisibility'
import { transformPayloadToSnakeCase } from '~/utils/transformPayload'
import { buildYupSchema } from '~/utils/buildYupSchema'
import { useValidation } from '~/composables/useValidation'
import { useWindowScroll } from '@vueuse/core'

const props = withDefaults(defineProps<{ webform?: WebformDefinition }>(), {
  webform: {} as WebformDefinition,
})

// Composables & Utilities
const { onError } = useValidation()
const { y } = useWindowScroll()
const toast = useToast()
const config = useRuntimeConfig()

const { webform: themeWebform } = useAppConfig().stirTheme

// Destructure webform props
const {
  fields = {},
  webformId = '',
  webformSubmissions = '',
  webformConfirmation = '',
  actions = [],
} = props.webform

// Reactive state
const turnstileToken = ref('')
const state = reactive({})
const isFormSubmitted = ref(false)
const isLoading = ref(false)
const errors = ref<Record<string, string>>({})

// Compute Yup schema dynamically
const schema = computed(() => buildYupSchema(fields, state))

// Maintain API order of fields
const orderedFieldNames = computed(() => Object.keys(fields))

// Determine submit button label from actions
const submitButtonLabel = computed(
  () => actions[0]?.['#submit_Label'] || 'Submit',
)

// Group fields dynamically for better rendering
const groupedFields = computed(() => {
  const grouped: Record<string, string[]> = {}
  orderedFieldNames.value.forEach((fieldName) => {
    const parent = fields[fieldName]?.parent
    if (parent) {
      if (!grouped[parent]) grouped[parent] = []
      grouped[parent].push(fieldName)
    }
  })
  return grouped
})

// Initialize state with form defaults
onMounted(() => {
  for (const [key, field] of Object.entries(fields)) {
    if (field['#composite']) {
      state[key] = state[key] || {} // Ensure it's an object
      for (const subKey in field['#composite']) {
        state[key][subKey] =
          state[key][subKey] || field['#composite'][subKey]['value'] || ''
      }
    } else {
      state[key] = field['#default'] || ''
    }
  }
})

// Helper functions for field rendering
const shouldRenderGroupContainer = (fieldName: string) =>
  fields[fieldName]?.parent &&
  groupedFields.value[fields[fieldName]?.parent]?.[0] === fieldName

const getGroupFields = (parentName: string) =>
  groupedFields.value[parentName] || []

const shouldRenderIndividualField = (fieldName: string) =>
  !fields[fieldName]?.parent

const isContainerVisible = (containerName: string) =>
  getGroupFields(containerName).some((fieldName) =>
    evaluateVisibility(fields[fieldName]?.['#states'] || {}, state),
  )

// Form submission handler
async function onSubmit(_event: FormSubmitEvent<Record<string, unknown>>) {
  isLoading.value = true
  errors.value = {}

  try {
    // Prepare Payload
    const payload = {
      webform_id: webformId,
      ...transformPayloadToSnakeCase(state),
      turnstile_response: turnstileToken.value,
    }

    // Submit Form Data
    await $fetch('/api/webform/submit', {
      method: 'POST',
      body: JSON.stringify(payload),
    })

    // Handle Successful Submission
    y.value = 0
    toast.add({
      title: 'Success!',
      description: 'Form submitted successfully!',
      color: 'success',
    })

    // Reset Form
    Object.keys(state).forEach((key) => (state[key] = ''))
    turnstileToken.value = ''
    isFormSubmitted.value = true
  } catch (error) {
    console.error('Submission Error:', error)

    // Handle Errors from Backend
    const errorMessage =
      error?.response?._data?.error?.message ||
      error?.response?._data?.message ||
      'Form submission failed. Please try again.'

    toast.add({
      title: 'Error',
      description: `Error submitting form: ${errorMessage}`,
      color: 'error',
    })
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <EditLink :link="webformSubmissions">
    <UForm
      v-if="!isFormSubmitted"
      :class="
        themeWebform.variant === 'material'
          ? themeWebform.spacingLarge
          : themeWebform.spacing
      "
      :schema="schema"
      :state="state"
      @error="onError"
      @submit="onSubmit"
    >
      <template v-for="fieldName in orderedFieldNames" :key="fieldName">
        <template
          v-if="
            shouldRenderGroupContainer(fieldName) &&
            isContainerVisible(fields[fieldName]?.parent)
          "
        >
          <h2 :class="themeWebform.fieldGroupHeader">
            {{ fields[fieldName]?.parent }}
          </h2>
          <div :class="themeWebform.fieldGroup">
            <template
              v-for="groupedFieldName in getGroupFields(
                fields[fieldName]?.parent,
              )"
              :key="groupedFieldName"
            >
              <FieldRenderer
                :field="fields[groupedFieldName]"
                :field-name="groupedFieldName"
                :state="state"
              />
            </template>
          </div>
        </template>

        <template v-else-if="shouldRenderIndividualField(fieldName)">
          <FieldRenderer
            :field="fields[fieldName]"
            :field-name="fieldName"
            :state="state"
          />
        </template>
      </template>

      <div v-if="!config.public.turnstileDisable">
        <p class="mb-2 text-sm font-medium">Let us know you’re human</p>
        <NuxtTurnstile v-model="turnstileToken" />
      </div>

      <UButton :label="submitButtonLabel" :loading="isLoading" type="submit" />
    </UForm>

    <div
      v-else
      :class="`${themeWebform.response} prose`"
      v-html="webformConfirmation"
    />
  </EditLink>
</template>
