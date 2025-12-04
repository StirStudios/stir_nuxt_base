<script setup lang="ts">
const { getPage, getDrupalBaseUrl, fetchMenu } = useDrupalCe()
const drupalBaseUrl = getDrupalBaseUrl()
const page = getPage()

const user = computed(() => page.value?.current_user || null)
const isAdministrator = computed(() =>
  user.value?.roles?.includes('administrator'),
)

const accountMenu = ref([])

const tabs = computed(
  () => page.value?.local_tasks ?? { primary: [], secondary: [] },
)
const user = computed(() => page.value?.current_user)

const getIconForLabel = (label: string): string | null => {
  const iconMap: Record<string, string> = {
    'Drupal CMS': 'i-lucide-home',
    Settings: 'i-lucide-settings',
    View: 'i-lucide-eye',
    Edit: 'i-lucide-pencil',
    Delete: 'i-lucide-trash-2',
    Revisions: 'i-lucide-copy',
    Export: 'i-lucide-upload',
    API: 'i-lucide-code',
    'Log out': 'i-lucide-log-out',
    'Log in': 'i-lucide-log-in',
    'My account': 'i-lucide-user',
  }

  return iconMap[label] || null
}

// Safe, clean async call with fallback
try {
  const rawMenu = await fetchMenu('account')
  accountMenu.value = Array.isArray(rawMenu.value)
    ? rawMenu.value.map((item) => ({
        label: item.title,
        to: item.relative || item.url,
        icon: getIconForLabel(item.title),
      }))
    : []
} catch (e) {
  console.error('Failed to fetch account menu:', e)
}

// Optional: helper to map local tasks
const getLocalTaskLinks = () =>
  tabs.value.primary.map((tab) => ({
    label: tab.label,
    to: tab.url,
    icon: getIconForLabel(tab.label),
  }))

// Dynamic nav links
const links = computed(() => {
  const baseLinks = [
    [
      {
        label: 'Drupal CMS',
        icon: getIconForLabel('Drupal CMS'),
        to: `${drupalBaseUrl}/admin/content`,
        target: '_self',
      },
    ],
  ]

  const localTaskLinks = tabs.value.primary?.length ? [getLocalTaskLinks()] : []

  const accountDropdown = [
    {
      label: user.value?.name || 'Account',
      icon: getIconForLabel('My account'),
      children: accountMenu.value,
    },
  ]

  return [...baseLinks, ...localTaskLinks, accountDropdown]
})
</script>

<template>
  <UNavigationMenu
    v-if="isAdministrator"
    content-orientation="vertical"
    highlight
    highlight-color="primary"
    :items="links"
    :ui="{
      root: 'sticky top-0 z-60 w-full backdrop-blur shadow bg-accented',
      link: 'text-xs text-default',
      linkLabel: 'hidden md:block',
      linkLeadingIcon: 'text-default',
    }"
  />
</template>
