<script setup lang="ts">
import type { WebformProps } from '~/types'
import { object, string, type InferType } from 'yup'

const toast = useToast()

const props = defineProps<WebformProps>()

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

// Infer the schema type for TypeScript
type Schema = InferType<typeof schema>

// Initialize the state with dynamic fields on mounted
onMounted(async () => {
  try {
    // Fetch the CSRF token
    const { data: csrfData } = await useFetch('/api/token')
    csrfToken.value = csrfData.value?.csrfToken || ''

    // Initialize formData and state for dynamic fields from props
    const fields = props.webform[0]?.fields || {}
    for (const field in fields) {
      formData[field] = ''
      state[field] = '' // Initialize state as well for reactivity
    }
  } catch (error) {
    console.error('Error fetching CSRF token:', error)
  }
})

// Submission handler
async function onSubmit(event: FormSubmitEvent<Schema>) {
  isLoading.value = true
  try {
    if (!turnstile.value) {
      toast.add({
        title: 'Error',
        description: 'Please complete the CAPTCHA',
        color: 'red',
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
      `${siteApi}/webform_rest/submit`,
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
        color: 'red',
      })
      return
    } else {
      toast.add({
        title: 'Success!',
        description: 'Form submitted successfully!',
        color: 'lime',
      })
    }

    // Clear form state and formData after successful submission
    for (const field in state) {
      state[field] = ''
      formData[field] = ''
    }

    isLoading.value = false
    isFormSubmitted.value = true
  } catch (error) {
    toast.add({
      title: 'Error',
      description: 'Error during submission: ' + error.message,
      color: 'red',
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
      class="mx-auto space-y-4 md:max-w-lg"
      :schema="schema"
      :state="state"
      @submit="onSubmit"
    >
      <template
        v-for="(field, fieldName) in webform[0].fields"
        :key="fieldName"
      >
        <UFormGroup
          :description="field['#description']"
          :label="field['#title']"
          :name="fieldName"
          :ui="{
            label: {
              base: 'text-sm block mb-1 font-medium text-gray-200 dark:text-gray-200',
            },
            help: 'mt-0 text-sm text-gray-500 dark:text-gray-400 italic pt-2 pb-0',
            error: 'mt-2 py-0 text-red-500 dark:text-red-400 text-sm',
          }"
        >
          <UInput
            v-if="field['#type'] === 'textfield' || field['#type'] === 'email'"
            v-model="state[fieldName]"
            :placeholder="field['#placeholder']"
            :type="field['#type']"
          />
          <UTextarea
            v-if="field['#type'] === 'textarea'"
            v-model="state[fieldName]"
            :placeholder="field['#placeholder']"
          />
          <template v-if="field['#help']" #help>
            {{ field['#help'] }}
          </template>
        </UFormGroup>
      </template>
      <template v-for="action in webform[0].actions" :key="action['#type']">
        <p
          class="mb-1 block pb-0 text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          Let us know you're human
        </p>
        <ClientOnly>
          <NuxtTurnstile v-model="turnstile" />
        </ClientOnly>
        <UButton
          :label="action['#submit_Label']"
          :loading="isLoading"
          size="lg"
          type="submit"
        />
      </template>
    </UForm>
    <UNotification
      v-else
      :id="webformId"
      class="mx-auto md:max-w-lg"
      color="lime"
      icon="i-heroicons-check-circle"
      :timeout="0"
    >
      <template #description="{ description }">
        <span v-html="webform[0].confirmationMessage" />
      </template>
    </UNotification>
  </WrapNone>
</template>
