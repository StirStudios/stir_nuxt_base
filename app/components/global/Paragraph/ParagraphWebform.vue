<script setup lang="ts">
import { evaluateVisibility } from '~/utils/evaluateVisibility'
import { transformPayloadToSnakeCase } from '~/utils/transformPayload'
import { buildYupSchema } from '~/utils/buildYupSchema'
import { useScroll } from '~/composables/useScroll'
import { useValidation } from '~/composables/useValidation'

const props = withDefaults(defineProps<{ webform: WebformDefinition }>(), {
  webform: {} as WebformDefinition,
})

// Composables & Utilities
const { onError } = useValidation()
const { scrollToTop } = useScroll()
const toast = useToast()
const config = useRuntimeConfig()
const appConfig = useAppConfig()
const siteApi = config.public.api

// Destructure webform props
const {
  fields = {},
  webformId = '',
  webformSubmissions = '',
  webformConfirmation = '',
  actions = [],
} = props.webform

// Reactive state
const csrfToken = ref('')
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
async function onSubmit(event: FormSubmitEvent<any>) {
  isLoading.value = true
  errors.value = {}

  try {
    // Validate CAPTCHA if required
    if (!config.public.turnstileDisable && !turnstileToken.value) {
      toast.add({
        title: 'Error',
        description: 'Please complete the CAPTCHA',
        color: 'error',
      })
      return
    }

    // Fetch CSRF Token
    const { csrfToken: token } = await $fetch<{ csrfToken: string }>(
      '/api/getCsrfToken',
    )
    csrfToken.value = token

    // Prepare payload
    const payload = {
      webform_id: webformId,
      turnstile_token: turnstileToken.value || '',
      ...transformPayloadToSnakeCase(state),
    }

    // Submit form data
    const { data: submitData, error: submitError } = await $fetch(
      `${siteApi}/api/stir_webform_rest/submit`,
      {
        method: 'POST',
        headers: {
          'x-csrf-token': csrfToken.value,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      },
    )

    // Handle submission errors
    if (submitError?.value) {
      toast.add({
        title: 'Error',
        description: `Error submitting form: ${submitError.value}`,
        color: 'error',
      })
      return
    }

    // Success handling
    scrollToTop()
    toast.add({
      title: 'Success!',
      description: 'Form submitted successfully!',
      color: 'success',
    })

    // Reset form state
    Object.keys(state).forEach((key) => (state[key] = ''))
    turnstileToken.value = ''
    isFormSubmitted.value = true
  } catch (validationError) {
    if (validationError.inner) {
      validationError.inner.forEach((err: any) => {
        errors.value[err.path] = err.message
      })
    } else {
      toast.add({
        title: 'Validation Error',
        description: validationError.message || 'Unknown validation error',
        color: 'error',
      })
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <WrapNone :wrapper="webformSubmissions ? 'div' : undefined">
    <EditLink :link="webformSubmissions" />
    <UForm
      v-if="!isFormSubmitted"
      :state="state"
      :schema="schema"
      :class="appConfig.stirTheme.webform.form"
      @submit="onSubmit"
      @error="onError"
    >
      <template
        v-for="(fieldName, index) in orderedFieldNames"
        :key="fieldName"
      >
        <template
          v-if="
            shouldRenderGroupContainer(fieldName) &&
            isContainerVisible(fields[fieldName]?.parent)
          "
        >
          <h2 :class="appConfig.stirTheme.webform.fieldGroupHeader">
            {{ fields[fieldName]?.parent }}
          </h2>
          <div :class="appConfig.stirTheme.webform.fieldGroup">
            <template
              v-for="groupedFieldName in getGroupFields(
                fields[fieldName]?.parent,
              )"
              :key="groupedFieldName"
            >
              <FieldRenderer
                :field="fields[groupedFieldName]"
                :fieldName="groupedFieldName"
                :state="state"
              />
            </template>
          </div>
        </template>

        <template v-else-if="shouldRenderIndividualField(fieldName)">
          <FieldRenderer
            :field="fields[fieldName]"
            :fieldName="fieldName"
            :state="state"
          />
        </template>
      </template>

      <div v-if="!config.public.turnstileDisable">
        <p class="mb-2 text-sm font-medium">Let us know you’re human</p>
        <NuxtTurnstile
          v-model="turnstileToken"
          sitekey="your-turnstile-site-key"
        />
      </div>

      <UButton
        :label="actions[0]?.['#submit_Label'] || 'Submit'"
        :loading="isLoading"
        size="lg"
        type="submit"
      />
    </UForm>

    <div
      v-else
      :class="`${appConfig.stirTheme.webform.response} prose`"
      v-html="webformConfirmation"
    />
  </WrapNone>
</template>
