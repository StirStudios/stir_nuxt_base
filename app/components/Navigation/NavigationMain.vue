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

// Set color mode toggle
const { isDark } = useColorModeToggle()

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
    class="fixed top-0 z-30 w-full transform bg-white/90 px-4 py-3 shadow backdrop-blur-md duration-500 dark:bg-gray-950/70"
    :class="{
      '-translate-y-full': !showNavbar,
      'pt-[3.9rem]': isAdministrator && showNavbar,
    }"
    role="navigation"
  >
    <UContainer>
      <div class="mx-auto flex flex-wrap items-center justify-between">
        <div class="order-1">
          <ULink aria-label="Site Logo" class="font-bold" to="/">
            <ClientOnly>
              <AppLogo
                :dark-mode="!isDark && !isScrolled && !isAdministrator"
              />
            </ClientOnly>
          </ULink>
        </div>
        <div class="order-2 flex">
          <UNavigationMenu
            class="hidden border-none md:block"
            :items="navLinks"
          >
            <template #default="{ link }">
              <span
                class="group-hover:text-primary relative block w-full duration-500"
              >
                {{ link.label }}
              </span>
            </template>
          </UNavigationMenu>
        </div>
        <div class="order-2 flex md:order-3">
          <ClientOnly>
            <UButton
              v-if="!appConfig.colorMode.forced"
              aria-label="Theme"
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
  <USlideover v-model:open="isOpen" title="Menu">
    <template #header>
      <div class="flex items-center justify-between">
        <ULink aria-label="Logo" to="/" @click="isOpen = false">
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
      </div>
    </template>
    <template #body>
      <UNavigationMenu
        orientation="vertical"
        :items="navLinks"
        :ui="{
          base: 'my-3 uppercase',
          label: 'text-center w-full',
          padding: 'px-3.5 py-2.5',
          size: 'text-lg',
        }"
        @click="isOpen = false"
      />
    </template>
  </USlideover>
</template>
