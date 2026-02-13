<script setup lang="ts">
import { usePageContext } from '~/composables/usePageContext'
const { getDrupalBaseUrl, fetchMenu } = useDrupalCe()
const { page } = usePageContext()
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

type LocalTask = { label: string; url: string }

const tabs = computed(
  () =>
    (page.value?.local_tasks as {
      primary: LocalTask[]
      secondary: LocalTask[]
    }) ?? { primary: [], secondary: [] },
)

const localTaskLinks = computed(() =>
  tabs.value.primary.map((tab: LocalTask) => ({
    label: tab.label,
    to: tab.url,
    icon: getIconForLabel(tab.label),
  })),
)

const accountMenu = ref<Array<{ label: string; to: string; icon: string | null }>>([])

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
    v-if="isAdministrator"
    content-orientation="vertical"
    highlight
    highlight-color="primary"
    :items="links"
    :ui="{
      root: 'sticky top-0 z-60 h-[3.1rem] w-full bg-zinc-200 text-zinc-800 dark-text-white dark:bg-zinc-900 p-4 shadow',
      link: 'text-xs text-default hover:before:bg-zinc-200/50 dark:hover:before:bg-zinc-900',
      linkLabel: 'hidden md:block',
      linkLeadingIcon: 'text-default',
      childLink: 'p-2 text-xs',
    }"
  />
</template>
