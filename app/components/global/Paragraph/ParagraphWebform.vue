<script setup lang="ts">
import { flattenWebformFields } from '~/utils/flattenWebformFields'
import { webformState } from '~/composables/useWebformState'
import { evaluateVisibility } from '~/utils/evaluateVisibility'
import { transformPayloadToSnakeCase } from '~/utils/transformPayload'
import { buildYupSchema } from '~/utils/buildYupSchema'
import { generateSummaryHTML } from '~/utils/generateSummaryHTML'
import { useValidation } from '~/composables/useValidation'
import { useWindowScroll } from '@vueuse/core'

const props = withDefaults(defineProps<{ webform?: WebformDefinition }>(), {
  webform: {} as WebformDefinition,
})

// Composables & Utilities
const { onError } = useValidation()
const { y } = useWindowScroll()
const toast = useToast()

const { webform: themeWebform } = useAppConfig().stirTheme

// Destructure webform props
const {
  fields: rawFields = {},
  webformId = '',
  webformSubmissions = '',
  webformConfirmation = '',
  actions = [],
} = props.webform

// Flatten the fields once at mount
const fields = flattenWebformFields(rawFields)

const state = reactive({})

// Then safely assign to shared store
webformState.fields = fields
webformState.state = state

// Reactive state
const turnstileToken = ref('')
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
      state[key] = state[key] || {}
      for (const subKey in field['#composite']) {
        state[key][subKey] =
          state[key][subKey] || field['#composite'][subKey]['value'] || ''
      }
    } else if (field['#type'] === 'checkboxes') {
      state[key] = Array.isArray(field['#default']) ? field['#default'] : []
    } else {
      state[key] = field['#default'] ?? ''
    }
  }
})

// Helper functions for field rendering
const containerTypes = ['section', 'fieldset', 'details', 'webform_section']

const shouldRenderGroupContainer = (fieldName: string) =>
  fields[fieldName]?.parent &&
  groupedFields.value[fields[fieldName]?.parent]?.[0] === fieldName &&
  !containerTypes.includes(fields[fieldName]['#type'])

const getGroupFields = (parentName: string) =>
  groupedFields.value[parentName] || []

const shouldRenderIndividualField = (fieldName: string) =>
  !fields[fieldName]?.parent &&
  !containerTypes.includes(fields[fieldName]['#type'])

const isContainerVisible = (containerName: string) =>
  getGroupFields(containerName).some((fieldName) =>
    evaluateVisibility(fields[fieldName]?.['#states'] || {}, state),
  )

onMounted(() => {
  for (const [key, field] of Object.entries(fields)) {
    if (field['#composite']) {
      state[key] = state[key] || {}
      for (const subKey in field['#composite']) {
        state[key][subKey] =
          state[key][subKey] || field['#composite'][subKey]['value'] || ''
      }
    } else if (field['#type'] === 'checkboxes') {
      state[key] = Array.isArray(field['#default']) ? field['#default'] : []
    } else {
      state[key] = field['#default'] ?? ''
    }
  }

  // ✅ Ensure hidden field exists in state (even if not rendered)
  if ('submission_summary' in fields && !state.submission_summary) {
    state.submission_summary = ''
  }
})

// Form submission handler
async function onSubmit(_event: FormSubmitEvent<Record<string, unknown>>) {
  isLoading.value = true
  errors.value = {}

  try {
    // 1. Calculate totals and generate HTML summary
    if ('submission_summary' in fields) {
      const summaryHtml = await import('~/utils/generateSummary').then((mod) =>
        mod.generateSummaryHTML(fields, state),
      )
      state.submission_summary = summaryHtml
    }

    console.log('[✔] Injected summary:', state.submission_summary)

    // 3. Transform payload
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

    Object.keys(state).forEach((key) => (state[key] = ''))
    turnstileToken.value = ''
    isFormSubmitted.value = true
  } catch (error) {
    console.error('Submission Error:', error)

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
    <WebformContent
      v-model:turnstile-token="turnstileToken"
      :fields="fields"
      :get-group-fields="getGroupFields"
      :grouped-fields="groupedFields"
      :is-container-visible="isContainerVisible"
      :is-form-submitted="isFormSubmitted"
      :is-loading="isLoading"
      :ordered-field-names="orderedFieldNames"
      :schema="schema"
      :should-render-group-container="shouldRenderGroupContainer"
      :should-render-individual-field="shouldRenderIndividualField"
      :state="state"
      :submit-button-label="submitButtonLabel"
      :theme-webform="themeWebform"
      :webform-confirmation="webformConfirmation"
      @error="onError"
      @submit="onSubmit"
    />
  </EditLink>
</template>
