<script lang="ts" setup>
import { useDrupalApi } from '~/composables/useDrupalApi'

// Fetch Drupal API data
const { page, isAdministrator, fetchMenu } = await useDrupalApi()

// Fetch main menu with error handling
let mainMenuArray = []
try {
  const mainMenu = await fetchMenu('main')
  mainMenuArray = mainMenu.value
} catch (error) {
  console.error('Error fetching menu:', error)
}

// Set color mode toggle
const { isDark } = useColorModeToggle()

// Map over the array of menu items to create navLinks
const navLinks = mainMenuArray.map((menuItem) => ({
  label: menuItem.title,
  to: menuItem.external
    ? menuItem.absolute
    : `/${menuItem.alias}${menuItem.options?.fragment ? `#${menuItem.options.fragment}` : ''}`,
}))

const showNavbar = ref(true)
const navbarOpen = ref(false)
const lastScrollPosition = ref(0)
const isOpen = ref(false)
const isScrolled = ref(false)
const route = useRoute()

// Computed class for repeated conditions
const themeClass = computed(() =>
  !isDark.value && !isScrolled.value && !isAdministrator.value
    ? 'text-white'
    : '',
)

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
      class="md:px-auto fixed top-0 z-10 w-full bg-white bg-opacity-90 px-4 px-8 py-3 shadow shadow-gray-300 backdrop-blur-md dark:bg-gray-950 dark:bg-opacity-70 dark:shadow-gray-700"
      :class="{
        'navbar--hidden': !showNavbar,
        sticky: isAdministrator && showNavbar,
      }"
      role="navigation"
    >
      <UContainer>
        <div class="mx-auto flex flex-wrap items-center justify-between">
          <div class="order-1">
            <ULink aria-label="Site Logo" class="font-bold" to="/">
              <template v-if="!page.site_info?.name">
                <ClientOnly>
                  <AppLogo
                    :dark-mode="!isDark && !isScrolled && !isAdministrator"
                  />
                </ClientOnly>
              </template>
              <template v-else>
                {{ page.site_info?.name }}
              </template>
            </ULink>
          </div>
          <div class="order-2 flex">
            <UHorizontalNavigation
              class="hidden border-none md:block"
              :links="navLinks"
              :ui="{
                after: '',
                container: 'block w-full sm:flex sm:items-center min-w-0',
                active:
                  isScrolled || isAdministrator
                    ? 'text-black'
                    : 'text-white dark:text-white after:bg-primary-500 dark:after:bg-primary-400 after:rounded-full',
                inactive:
                  !isScrolled && !isAdministrator
                    ? 'text-white dark:text-white'
                    : 'text-black dark:text-white hover:text-gray-900 dark:hover:text-white',
              }"
            >
              <template #default="{ link }">
                <span
                  class="group-hover:text-primary relative block w-full duration-500"
                >
                  {{ link.label }}
                </span>
              </template>
            </UHorizontalNavigation>
          </div>
          <div class="order-2 flex md:order-3">
            <ClientOnly>
              <UButton
                aria-label="Theme"
                :class="themeClass"
                color="black"
                :icon="
                  isDark
                    ? 'i-heroicons-moon-20-solid'
                    : 'i-heroicons-sun-20-solid'
                "
                size="lg"
                variant="ghost"
                @click="isDark = !isDark"
              />
              <UButton
                aria-label="Site navigation toggle"
                class="block flex items-center md:hidden"
                :class="themeClass"
                color="black"
                :icon="
                  navbarOpen
                    ? 'i-heroicons-x-mark-solid'
                    : 'i-heroicons-bars-3-solid'
                "
                size="xl"
                variant="ghost"
                @click="isOpen = true"
              />
            </ClientOnly>
          </div>
        </div>
      </UContainer>
    </nav>
    <USlideover
      v-model="isOpen"
      :ui="{
        width: 'w-full max-w-full',
      }"
    >
      <UCard
        class="size-lg flex flex-1 flex-col"
        :ui="{
          body: { base: 'flex-1' },
          ring: '',
          divide: 'divide-y divide-gray-100 dark:divide-gray-800',
        }"
      >
        <template #header>
          <div class="flex items-center justify-between">
            <ULink class="m-auto !outline-none" to="/" @click="isOpen = false">
              <template v-if="page.site_info?.name">
                <AppLogo />
              </template>
              <template v-else>
                {{ page.site_info?.name }}
              </template>
            </ULink>
            <UButton
              class="-my-1"
              color="gray"
              icon="i-heroicons-x-mark-20-solid"
              variant="ghost"
              @click="isOpen = false"
            />
          </div>
        </template>
        <UVerticalNavigation
          :links="navLinks"
          :ui="{
            base: 'my-3 uppercase',
            label: 'text-center w-full',
            padding: 'px-3.5 py-2.5',
            size: 'text-lg',
          }"
          @click="isOpen = false"
        />
      </UCard>
    </USlideover>
  </header>
</template>

<style scoped lang="css">
nav {
  @apply z-50 translate-y-0 duration-500;
}
.navbar--hidden {
  @apply -translate-y-full;
}
</style>
