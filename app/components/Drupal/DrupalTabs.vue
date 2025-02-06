<script setup lang="ts">
import type { TabsProps } from '~/types/NavigationTypes'

const props = defineProps<TabsProps>()
const config = useRuntimeConfig()
const siteApi = config.public.api

const { fetchMenu } = useDrupalCe()
const accountMenu = ref([])

// Load account menu items with a specific icon for 'Log out'
async function loadAccountMenu() {
  try {
    const menuResponse = await fetchMenu('account')

    // Access the reactive `_value` directly and safely handle the result
    const menuItems = Array.isArray(menuResponse?._value)
      ? menuResponse._value
      : []

    accountMenu.value = menuItems.map((item) => ({
      label: item.title,
      to: item.relative || item.url,
      icon:
        item.title === 'Log out'
          ? 'i-heroicons-arrow-left-start-on-rectangle'
          : null, // Assign icon to logout, leave others without icons
    }))
  } catch (error) {
    console.error('Error fetching account menu:', error)
  }
}

await loadAccountMenu()

// Get local task links
const getLocalTaskLinks = () => {
  return props.tabs.primary.map((tab) => ({
    label: tab.label,
    to: tab.url,
    icon: filterIconByLabel(tab.label),
  }))
}

// Assign icons based on tab labels
const filterIconByLabel = (label: string) => {
  switch (label) {
    case 'View':
      return 'i-heroicons-eye'
    case 'Edit':
      return 'i-heroicons-pencil'
    case 'Delete':
      return 'i-heroicons-trash'
    case 'Revisions':
      return 'i-heroicons-document-duplicate'
    case 'Export':
      return 'i-heroicons-arrow-up-tray'
    case 'API':
      return 'i-heroicons-code-bracket'
    default:
      return null
  }
}

// Dynamically compute links for the navigation
const links = computed(() => {
  const baseLinks = [
    [
      {
        label: 'Drupal CMS',
        icon: 'i-heroicons-home',
        to: `${siteApi}/admin/content`,
      },
    ],
  ]

  const localTaskLinks =
    props.tabs.primary && props.tabs.primary.length > 0
      ? [getLocalTaskLinks()]
      : []

  const accountDropdown = [
    {
      label: 'Account',
      icon: 'i-heroicons-user-circle',
      children: accountMenu.value, // Add dynamic account links as children
    },
  ]

  return [...baseLinks, ...localTaskLinks, accountDropdown]
})
</script>

<template>
  <div
    aria-label="Admin navigation"
    role="navigation"
    class="md:px-auto sticky top-0 z-50 h-[3.1rem] w-full bg-zinc-200 px-4 px-8 text-black shadow shadow-gray-300 backdrop-blur-md dark:bg-gray-800 dark:text-white dark:shadow-gray-700"
  >
    <UNavigationMenu
      :items="links"
      :ui="{
        base: 'text-xs',
        label: 'truncate relative hidden md:block',
      }"
    />
  </div>
</template>
