<script lang="ts" setup>
import { usePageContext } from '~/composables/usePageContext'

const { page, isAdministrator } = usePageContext()
const { fetchMenu } = useDrupalCe()
const mainMenu = await fetchMenu('main')

// Fetch main menu with error handling
let mainMenuArray = []
try {
  const mainMenu = await fetchMenu('main')
  mainMenuArray = mainMenu.value
} catch (error) {
  console.error('Error fetching menu:', error)
}

// Map over the array of menu items to create navLinks
const navLinks = mainMenuArray.map((menuItem) => ({
  label: menuItem.title,
  to: menuItem.external
    ? menuItem.absolute
    : `/${menuItem.alias}${menuItem.options?.fragment ? `#${menuItem.options.fragment}` : ''}`,
}))

const appConfig = useAppConfig()
const showNavbar = ref(true)
const navbarOpen = ref(false)
const lastScrollPosition = ref(0)
const isOpen = ref(false)
const isScrolled = ref(false)
const route = useRoute()

// Scroll event handler
const onScroll = () => {
  const currentScrollPosition =
    window.pageYOffset || document.documentElement.scrollTop
  if (currentScrollPosition < 0) return
  if (Math.abs(currentScrollPosition - lastScrollPosition.value) < 40) return
  showNavbar.value = currentScrollPosition < lastScrollPosition.value
  lastScrollPosition.value = currentScrollPosition
  navbarOpen.value = false
  isScrolled.value = currentScrollPosition > 50
}

// Throttle scroll event handler
let scrollTimeout: number | null = null
const throttledOnScroll = () => {
  if (scrollTimeout) return
  scrollTimeout = window.setTimeout(() => {
    onScroll()
    scrollTimeout = null
  }, 100)
}

onMounted(() => {
  window.addEventListener('scroll', throttledOnScroll)
  onScroll()
  if (route.hash) {
    isScrolled.value = true
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', throttledOnScroll)
  if (scrollTimeout) clearTimeout(scrollTimeout)
})
</script>

<template>
  <nav
    aria-label="Site navigation"
    role="navigation"
    :class="[
      appConfig.stirTheme.navigation.base,
      // Apply no background if transparentTop is true and not scrolled (for admin and non-admin)
      appConfig.stirTheme.navigation.transparentTop &&
      !isScrolled &&
      (!isAdministrator || isAdministrator)
        ? ''
        : appConfig.stirTheme.navigation.background,
      {
        '-translate-y-full':
          !showNavbar ||
          (appConfig.stirTheme.navigation.isHidden && !isScrolled),
      },
    ]"
  >
    <div
      :class="`${appConfig.stirTheme.container} mx-auto flex flex-wrap items-center justify-between`"
    >
      <div class="order-1">
        <ULink aria-label="Site Logo" class="font-bold" to="/">
          <template v-if="appConfig.stirTheme.navigation.logo">
            <AppLogo />
          </template>
          <template v-else>
            {{ page.site_info?.name }}
          </template>
        </ULink>
      </div>
      <UNavigationMenu
        :highlight="appConfig.stirTheme.navigation.highlight.show"
        :highlight-color="
          appConfig.stirTheme.navigation.highlight.show
            ? appConfig.stirTheme.navigation.highlight.color
            : ''
        "
        :color="appConfig.stirTheme.navigation.color"
        :variant="appConfig.stirTheme.navigation.variant"
        class="order-2 flex hidden border-none md:block"
        :items="navLinks"
      />
      <div
        class="order-2 flex md:order-3"
        :class="{
          'md:hidden': appConfig.colorMode?.forced,
        }"
      >
        <IconsColorMode />
        <UButton
          aria-label="Site navigation toggle"
          class="block flex items-center md:hidden"
          color="black"
          :icon="
            navbarOpen ? 'i-heroicons-x-mark-solid' : 'i-heroicons-bars-3-solid'
          "
          size="xl"
          variant="ghost"
          @click="isOpen = true"
        />
      </div>
    </div>
  </nav>
  <USlideover
    v-model:open="isOpen"
    title="Menu"
    :ui="{
      header: 'flex items-center justify-between gap-1.5 p-4 sm:px-6 min-h-16',
    }"
  >
    <template #header>
      <ULink
        v-if="appConfig.stirTheme.navigation.slideover.logo"
        aria-label="Logo"
        to="/"
        @click="isOpen = false"
      >
        <AppLogo />
      </ULink>
      <UButton
        aria-label="Close"
        class="-my-1"
        color="gray"
        icon="i-heroicons-x-mark-20-solid"
        variant="ghost"
        @click="isOpen = false"
      />
    </template>
    <template #body>
      <UNavigationMenu
        :ui="{
          link: appConfig.stirTheme.navigation.slideover.link,
        }"
        orientation="vertical"
        :items="navLinks"
      />
    </template>
  </USlideover>
</template>
