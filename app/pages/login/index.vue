<script setup lang="ts">
import { object, string } from 'yup'

const config = useAppConfig().protectedRoutes
const heading = computed(() => config?.loginHeading || 'Login')

const toast = useToast()
const isLoading = ref(false)
const showLogin = ref(false)

const state = reactive({ password: '' })
const schema = object({ password: string().required('Password is required') })

const session = useUserSession()
const { onError } = useValidation()
const route = useRoute()
const router = useRouter()

async function onSubmit(event: FormSubmitEvent<typeof state>) {
  isLoading.value = true

  try {
    await $fetch('/api/auth/login', {
      method: 'POST',
      body: { password: event.data.password },
    })

    await session.fetch()

    if (session.loggedIn.value) {
      toast.add({
        title: 'Success',
        description: 'Access granted!',
        color: 'success',
      })
      await navigateTo(config?.redirectOnLogin || '/')
    } else {
      toast.add({
        title: 'Session error',
        description: 'Login succeeded but session not active',
        color: 'warning',
      })
    }
  } catch {
    toast.add({
      title: 'Error',
      description: 'Incorrect password',
      color: 'error',
    })
  } finally {
    isLoading.value = false
  }
}

// Auto-login if URL contains ?password=...
onMounted(async () => {
  const passwordFromUrl = route.query.password
  if (typeof passwordFromUrl === 'string') {
    state.password = passwordFromUrl
    await onSubmit({ data: { password: passwordFromUrl } })

    // Remove password from URL
    const { password, ...cleanedQuery } = route.query
    router.replace({ query: cleanedQuery })
  }
})
</script>

<template>
  <div
    class="relative flex h-screen w-screen flex-col items-center justify-center overflow-hidden bg-cover bg-center bg-no-repeat px-4 text-center"
    role="presentation"
  >
    <h1>{{ heading }}</h1>

    <UButton
      v-if="!showLogin"
      label="Enter Password"
      size="xl"
      variant="solid"
      @click="showLogin = true"
    />

    <main
      v-if="showLogin"
      aria-labelledby="login-heading"
      class="bg-default/90 w-full max-w-md space-y-4 rounded-lg p-8 shadow-lg"
      role="main"
    >
      <UForm
        :schema="schema"
        :state="state"
        @error="onError"
        @submit="onSubmit"
      >
        <FieldRenderer
          :field="{
            '#type': 'textfield',
            '#title': 'Password',
            '#attributes': {
              type: 'password',
              id: 'password',
              'aria-label': 'password',
            },
          }"
          field-name="password"
          :state="state"
        />

        <UButton
          class="mt-10 w-full justify-center"
          label="Submit"
          :loading="isLoading"
          type="submit"
        />
      </UForm>
    </main>
  </div>
</template>
