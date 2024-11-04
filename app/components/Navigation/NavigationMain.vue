<script setup lang="ts">
import { useDrupalApi } from '~/composables/useDrupalApi'

// Fetch data from Drupal API
const { page, isAdministrator, fetchMenu } = await useDrupalApi()
const mainMenu = await fetchMenu('main')

// Extract the raw array value from the reactive ref object
const mainMenuArray = mainMenu.value

// Set color mode toggle
const { isDark } = useColorModeToggle()

// Map over the array of menu items to create navLinks in the format required by UNavigationMenu
const navLinks = ref(
  mainMenuArray.map((menuItem) => ({
    label: menuItem.title,
    to: menuItem.external
      ? menuItem.absolute
      : `/${menuItem.alias}${menuItem.options && menuItem.options.fragment ? `#${menuItem.options.fragment}` : ''}`,
    children: menuItem.children?.map((child) => ({
      label: child.title,
      to: child.external ? child.absolute : `/${child.alias}`,
    })),
  })),
)

const showNavbar = ref(true)
const isOpen = ref(false)
const isScrolled = ref(false)
const route = useRoute()

// Scroll event handler
const onScroll = () => {
  const currentScrollPosition =
    window.pageYOffset || document.documentElement.scrollTop
  if (currentScrollPosition < 0) return
  showNavbar.value = currentScrollPosition < 50
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
  if (route.hash) {
    isScrolled.value = true
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', throttledOnScroll)
})
</script>

<template>
  <div
    v-if="isAdministrator"
    id="admin-menu"
    aria-label="Admin navigation"
    class="sticky top-0 z-50 h-[3.1rem]"
    role="navigation"
  />
  <header aria-label="Site header">
    <nav
      aria-label="Site navigation"
      class="md:px-auto bg-opacity-90 dark:bg-opacity-70 fixed top-0 z-10 w-full bg-white px-4 py-3 shadow shadow-gray-300 backdrop-blur-md dark:bg-gray-950 dark:shadow-gray-700"
      :class="{
        'navbar--hidden': !showNavbar,
        sticky: isAdministrator && showNavbar,
      }"
      role="navigation"
    >
      <UContainer>
        <div class="mx-auto flex flex-wrap items-center justify-between">
          <!-- Logo -->
          <ULink aria-label="Site Logo" class="font-bold" to="/">
            <template v-if="!page.site_info?.name">
              <AppLogo />
            </template>
            <template v-else>
              {{ page.site_info?.name }}
            </template>
          </ULink>

          <!-- Desktop Navigation -->
          <div class="order-2">
            <UNavigationMenu
              class="hidden md:block"
              :items="navLinks"
              highlight
              orientation="horizontal"
            />
          </div>

          <!-- Theme Toggle and Mobile Menu Button -->
          <div class="order-3">
            <ClientOnly>
              <UButton
                aria-label="Theme"
                color="gray"
                :icon="
                  isDark
                    ? 'i-heroicons-moon-20-solid'
                    : 'i-heroicons-sun-20-solid'
                "
                variant="ghost"
                @click="isDark = !isDark"
              />
            </ClientOnly>
            <UButton
              aria-label="Open mobile menu"
              class="block md:hidden"
              color="gray"
              icon="i-heroicons-bars-3-solid"
              variant="ghost"
              @click="isOpen = true"
            />
          </div>
        </div>
      </UContainer>
    </nav>

    <!-- Mobile Navigation -->
    <USlideover
      v-model="isOpen"
      title="Slideover with close button"
      :close="{
        color: 'primary',
        variant: 'outline',
        class: 'rounded-full',
      }"
    >
      <UButton
        class="self-end"
        icon="i-heroicons-x-mark-20-solid"
        variant="ghost"
        @click="isOpen = false"
      />
      <template #body>
        <UNavigationMenu
          :items="navLinks"
          orientation="vertical"
          color="neutral"
          @click="isOpen = false"
        />
      </template>
    </USlideover>
  </header>
</template>

<style>
@import 'tailwindcss';
@import '@nuxt/ui';
nav {
  @apply z-50 translate-y-0 duration-500;
}
.navbar--hidden {
  @apply -translate-y-full;
}
</style>
