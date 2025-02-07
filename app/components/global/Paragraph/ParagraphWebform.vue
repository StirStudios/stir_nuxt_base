<script setup lang="ts">
import type { WebformProps } from '~/types/FormTypes'
import { object, string, type InferType } from 'yup'

const props = defineProps<WebformProps>()

const toast = useToast()

// Reactive state for form data and CSRF token
const formData = reactive<{ [key: string]: string }>({})
const csrfToken = ref('')
const webformId = props.webform[0]?.webformId
const webformSubmissions = props.webform[0]?.webformSubmissions
const config = useRuntimeConfig()
const siteApi = config.public.api
const turnstile = ref()
const isFormSubmitted = ref(false)
const isLoading = ref(false)

// Reactive state for form fields
const state = reactive<{ [key: string]: any }>({})

// Dynamic schema creation based on webform fields
const schema = object(
  Object.keys(props.webform[0].fields).reduce(
    (acc, fieldName) => {
      const field = props.webform[0].fields[fieldName]
      if (field['#type'] === 'email') {
        acc[fieldName] = string()
          .email('Invalid email format')
          .required(field['#requiredError'] || 'Email is required')
          .nullable()
      } else {
        acc[fieldName] = field['#required']
          ? string()
              .required(field['#requiredError'] || 'Required')
              .nullable()
          : string().nullable()
      }
      return acc
    },
    {} as { [key: string]: any },
  ),
)

type Schema = InferType<typeof schema>

// Initialize the state with dynamic fields on mounted
onMounted(async () => {
  try {
    const response = await $fetch<{ csrfToken: string }>('/api/getCsrfToken')
    csrfToken.value = response.csrfToken

    for (const field of Object.keys(props.webform[0]?.fields || {})) {
      formData[field] = ''
      state[field] = ''
    }
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Error fetching CSRF token:', error)
    }
    csrfToken.value = ''
    toast.add({
      title: 'Error',
      description:
        'There was an issue initializing the form. Please try again later.',
      color: 'error',
    })
  }
})

// Form submission handler
async function onSubmit(event: FormSubmitEvent<Schema>) {
  isLoading.value = true
  try {
    if (!config.public.turnstileDisable && !turnstile.value) {
      toast.add({
        title: 'Error',
        description: 'Please complete the CAPTCHA',
        color: 'error',
      })
      return
    }

    // Populate formData with values from state
    Object.keys(state).forEach((fieldName) => {
      formData[fieldName] = state[fieldName] || ''
    })

    const payload = {
      webform_id: webformId,
      ...formData,
    }

    // Send the form submission
    const { data: submitData, error: submitError } = await useFetch(
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

    if (submitError.value) {
      toast.add({
        title: 'Error',
        description: 'Error submitting form: ' + submitError.value,
        color: 'error',
      })
      return
    } else {
      toast.add({
        title: 'Success!',
        description: 'Form submitted successfully!',
        color: 'success',
      })
    }

    // Clear form state and formData after successful submission
    for (const field in state) {
      state[field] = ''
      formData[field] = ''
    }
    isFormSubmitted.value = true
  } catch (error) {
    toast.add({
      title: 'Error',
      description: 'Error during submission: ' + error.message,
      color: 'error',
    })
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
      class="mx-auto space-y-8 md:max-w-lg"
      :schema="schema"
      :state="state"
      @submit="onSubmit"
    >
      <FieldRenderer
        v-for="(field, fieldName) in props.webform[0].fields"
        :key="fieldName"
        :field="field"
        :fieldName="fieldName"
        :state="state"
      />

      <template
        v-for="action in props.webform[0].actions"
        :key="action['#type']"
      >
        <p class="mb-2 block text-sm/6 font-medium">Let us know you're human</p>
        <NuxtTurnstile v-model="turnstile" />
        <UButton
          :label="action['#submit_Label']"
          :loading="isLoading"
          size="lg"
          type="submit"
        />
      </template>
    </UForm>

    <!-- Submission Confirmation -->
    <div v-else class="text-center">
      <h3 class="text-xl font-bold">Thank You!</h3>
      <div
        class="webform-response"
        v-html="props.webform[0].webformConfirmation"
      ></div>
    </div>
  </WrapNone>
</template>
