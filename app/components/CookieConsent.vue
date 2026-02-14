<script setup lang="ts">
const { cookieConsent: config } = useAppConfig()
const route = useRoute()
const open = ref(false)
const isDev = import.meta.dev
const consent = useCookie<boolean>('cookie_consent', {
  maxAge: 60 * 60 * 24 * 365,
})

const isConfigured = computed(() => {
  if (!config?.enabled) return false

  return Boolean(config.title && config.message && config.buttonLabel)
})

function accept() {
  consent.value = true
  open.value = false
}

const ignorePaths = computed(() =>
  [config?.termsUrl, config?.privacyUrl].filter(
    (path): path is string => typeof path === 'string' && path.length > 0,
  ),
)

watch(
  () => route.path,
  () => {
    if (!import.meta.client) return

    const isBot = navigator?.userAgent
      ? /bot|crawl|spider/i.test(navigator.userAgent)
      : false

    if (
      !consent.value &&
      isConfigured.value &&
      !isBot &&
      !ignorePaths.value.includes(route.path)
    ) {
      open.value = true
    }
  },
  { immediate: true },
)
</script>

<template>
  <UDrawer
    v-if="isConfigured"
    v-model:open="open"
    :description="config.message"
    :dismissible="false"
    :handle="false"
    :modal="false"
    :overlay="false"
    side="bottom"
    :title="config.title"
    :ui="{
      container: 'overflow-y-auto shadow-lg',
      body: 'text-center text-xs leading-loose',
      title: 'sr-only',
      description: 'sr-only',
    }"
  >
    <template #body>
      <p>{{ config.message }}</p>

      <p v-if="config.termsUrl || config.privacyUrl">
        {{ config.messageLinks }}
        <ULink
          v-if="config.termsUrl"
          class="underline"
          rel="noopener noreferrer"
          target="_blank"
          :to="config.termsUrl"
        >
          Terms of Service
        </ULink>
        <span v-if="config.termsUrl && config.privacyUrl" class="mx-1">and</span>
        <ULink
          v-if="config.privacyUrl"
          class="underline"
          rel="noopener noreferrer"
          target="_blank"
          :to="config.privacyUrl"
        >
          Privacy Policy</ULink
        >.
      </p>
    </template>

    <template #footer>
      <div class="flex justify-center px-6 pb-4">
        <UButton :label="config.buttonLabel" size="xs" @click="accept" />
      </div>
    </template>
  </UDrawer>

  <UAlert
    v-else-if="config?.enabled && isDev"
    color="warning"
    description="Cookie consent is enabled but not fully configured. Please provide title,
      message, and buttonLabel."
    title="Heads up!"
    :ui="{
      root: 'fixed inset-x-0 bottom-0 rounded-none',
      wrapper: 'text-center',
      description: 'opacity-100',
    }"
  />
</template>
