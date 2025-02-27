<script setup lang="ts">
import type { TabsProps } from '~/types/NavigationTypes'

const props = defineProps<TabsProps>()
const config = useRuntimeConfig()
const siteApi = config.public.api

// Function to format local task links
const getLocalTaskLinks = () => {
  return props.tabs.primary.map((tab) => ({
    label: tab.label,
    to: tab.url,
    icon: filterIconByLabel(tab.label),
  }))
}

// Custom function to filter icons based on tab labels
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

let links = []

if (props.tabs.primary && props.tabs.primary.length > 0) {
  links = [
    [
      {
        label: 'Drupal CMS',
        icon: 'i-heroicons-home',
        to: `${siteApi}/admin/content`,
      },
    ],
    [...getLocalTaskLinks()],
    [
      {
        label: 'Log out',
        icon: 'i-heroicons-arrow-left-start-on-rectangle',
        to: `${siteApi}/user/logout`,
      },
    ],
  ]
} else {
  links = [
    [
      {
        label: 'Drupal CMS',
        icon: 'i-heroicons-home',
        to: `${siteApi}/admin/content`,
      },
    ],
    [
      {
        label: 'Log out',
        icon: 'i-heroicons-arrow-left-start-on-rectangle',
        to: `${siteApi}/user/logout`,
      },
    ],
  ]
}
</script>

<template>
  <div
    aria-label="Admin navigation"
    role="navigation"
    class="md:px-auto sticky top-0 z-50 h-[3.1rem] w-full bg-zinc-200 px-4 px-8 text-black shadow shadow-gray-300 backdrop-blur-md dark:bg-gray-800 dark:text-white dark:shadow-gray-700"
  >
    <UHorizontalNavigation
      :links="links"
      :ui="{
        base: 'text-xs',
        label: 'truncate relative hidden md:block',
      }"
    />
  </div>
</template>
