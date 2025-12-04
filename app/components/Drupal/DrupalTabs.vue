<script setup lang="ts">
const { getPage, getDrupalBaseUrl, fetchMenu } = useDrupalCe()

const page = getPage()
const drupalBaseUrl = getDrupalBaseUrl()

const user = computed(() => page.value?.current_user || null)
const isAdministrator = computed(() =>
  user.value?.roles?.includes('administrator'),
)

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

const tabs = computed(
  () => page.value?.local_tasks ?? { primary: [], secondary: [] },
)

const localTaskLinks = computed(() =>
  tabs.value.primary.map((tab) => ({
    label: tab.label,
    to: tab.url,
    icon: getIconForLabel(tab.label),
  })),
)

const accountMenu = ref([])

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

  const tasks = localTaskLinks.value.length ? [localTaskLinks.value] : []

  const accountDropdown = [
    {
      label: user.value?.name || 'Account',
      icon: getIconForLabel('My account'),
      children: accountMenu.value,
    },
  ]

  return [...baseLinks, ...tasks, accountDropdown]
})
</script>

<template>
  <UNavigationMenu
    v-if="!isAdministrator"
    content-orientation="vertical"
    highlight
    highlight-color="primary"
    :items="links"
    :ui="{
      root: 'sticky top-0 z-60 h-[3.1rem] w-full bg-neutral-200 dark:bg-neutral-900 p-4 shadow',
      link: 'text-xs text-black dark:text-white',
      linkLabel: 'hidden md:block',
      linkLeadingIcon: 'text-black dark:text-white',
    }"
  />
</template>
