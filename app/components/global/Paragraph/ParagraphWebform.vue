<script setup lang="ts">
import { object, string, ObjectSchema } from 'yup'

const props = withDefaults(
  defineProps<{
    webform: WebformDefinition
  }>(),
  {
    webform: {} as WebformDefinition,
  },
)

const toast = useToast()
const config = useRuntimeConfig()
const siteApi = config.public.api

// Extract webform data
const {
  fields = {},
  webformId = '',
  webformSubmissions = '',
  webformConfirmation = '',
  actions = [],
} = props.webform

const csrfToken = ref('')
const turnstileToken = ref('')
const state = ref(
  Object.keys(fields).reduce(
    (acc, key) => {
      acc[key] = fields[key]['#default'] || ''
      return acc
    },
    {} as Record<string, any>,
  ),
)

const isFormSubmitted = ref(false)
const isLoading = ref(false)

// Build Yup validation schema dynamically
const schema: ObjectSchema = object(
  Object.keys(fields).reduce(
    (acc, key) => {
      const field = fields[key]
      acc[key] = field['#required']
        ? field['#type'] === 'email'
          ? string().email('Invalid email').required('This field is required')
          : string().required('This field is required')
        : string().nullable()
      return acc
    },
    {} as Record<string, any>,
  ),
)

// Fetch CSRF token and initialize state
onMounted(async () => {
  try {
    const { csrfToken: token } = await $fetch<{ csrfToken: string }>(
      '/api/getCsrfToken',
    )
    csrfToken.value = token
  } catch (error) {
    toast.add({
      title: 'Error',
      description: 'Failed to initialize the form. Please try again later.',
      color: 'error',
    })
  }
})

// Submission handler
async function onSubmit(event: FormSubmitEvent<any>) {
  isLoading.value = true
  try {
    if (!config.public.turnstileDisable && !turnstileToken.value) {
      toast.add({
        title: 'Error',
        description: 'Please complete the CAPTCHA',
        color: 'error',
      })
      return
    }

    // Validate the form state using Yup schema
    await schema.validate(
      { ...state.value, turnstile: turnstileToken.value },
      { abortEarly: false },
    )

    const payload = {
      webform_id: webformId,
      ...state.value,
      turnstile: turnstileToken.value,
    }

    const { data, error } = await useFetch(
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

    if (error.value) {
      toast.add({
        title: 'Submission Error',
        description: `Error: ${error.value.message || 'Unknown error'}`,
        color: 'error',
      })
    } else if (data.value) {
      toast.add({
        title: 'Success!',
        description: 'Form submitted successfully!',
        color: 'success',
      })
      resetFormState()
      isFormSubmitted.value = true
    }
  } catch (validationError) {
    toast.add({
      title: 'Validation Error',
      description: validationError.errors.join(', '),
      color: 'error',
    })
  } finally {
    isLoading.value = false
  }
}

// Reset form state
function resetFormState() {
  for (const key in state.value) {
    state.value[key] = ''
  }
  turnstileToken.value = ''
}

const submitButtonLabel = actions[0]?.['#submit_Label'] || 'Submit'
</script>

<template>
  <WrapNone :wrapper="webformSubmissions ? 'div' : undefined">
    <UForm
      v-if="!isFormSubmitted"
      :state="state"
      :schema="schema"
      class="mx-auto space-y-8 md:max-w-lg"
      @submit="onSubmit"
    >
      <template v-for="(field, fieldName) in fields" :key="fieldName">
        <FieldRenderer :field="field" :fieldName="fieldName" :state="state" />
      </template>

      <div v-if="!config.public.turnstileDisable">
        <p class="mb-2 text-sm font-medium">Let us know you’re human</p>
        <NuxtTurnstile
          v-model="turnstileToken"
          sitekey="your-turnstile-site-key"
        />
      </div>

      <UButton
        :label="submitButtonLabel"
        :loading="isLoading"
        size="lg"
        type="submit"
      />
    </UForm>

    <div v-else class="text-center">
      <h3 class="text-xl font-bold">Thank You!</h3>
      <div class="webform-response" v-html="webformConfirmation" />
    </div>
  </WrapNone>
</template>
