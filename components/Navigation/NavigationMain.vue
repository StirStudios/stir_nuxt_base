<script lang="ts" setup>
import { useDrupalApi } from '~/composables/useDrupalApi'
const { page, isAdministrator, fetchMenu } = await useDrupalApi()
const mainMenu = await fetchMenu('main')

// Extract the raw array value from the reactive ref object 'mainMenu'
const mainMenuArray = mainMenu.value

// Set color mode toggle.
const { isDark } = useColorModeToggle()

// Map over the array of menu items to create navLinks
const navLinks = mainMenuArray.map((menuItem) => ({
  label: menuItem.title,
  to: menuItem.external
    ? menuItem.absolute
    : `/${menuItem.alias}${menuItem.options && menuItem.options.fragment ? `#${menuItem.options.fragment}` : ''}`,
}))

const showNavbar = ref(true)
const navbarOpen = ref(false)
const lastScrollPosition = ref(0)
const isOpen = ref(false)

// Scroll event handler
const onScroll = () => {
  const currentScrollPosition =
    window.pageYOffset || document.documentElement.scrollTop
  if (currentScrollPosition < 0) return
  if (Math.abs(currentScrollPosition - lastScrollPosition.value) < 40) return
  showNavbar.value = currentScrollPosition < lastScrollPosition.value
  lastScrollPosition.value = currentScrollPosition
  navbarOpen.value = false
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
    class="sticky top-0 z-20 h-[3.1rem]"
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
                <AppLogo />
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
              aria-label="Site navigation toggle"
              class="block flex items-center md:hidden"
              color="gray"
              :icon="
                navbarOpen
                  ? 'i-heroicons-x-mark-solid'
                  : 'i-heroicons-bars-3-solid'
              "
              size="xl"
              variant="ghost"
              @click="isOpen = true"
            />
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
  @apply translate-y-0 duration-500;
}
.navbar--hidden {
  @apply -translate-y-full;
}
</style>
