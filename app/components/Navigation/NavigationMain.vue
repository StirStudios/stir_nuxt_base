<script lang="ts" setup>
import { useWindowScroll, useThrottleFn } from '@vueuse/core'
import { usePageContext } from '~/composables/usePageContext'

const { page, isAdministrator } = usePageContext()
const { fetchMenu } = useDrupalCe()
const appConfig = useAppConfig()
const theme = appConfig.stirTheme
const route = useRoute()

// Fetch menu items
const mainMenu = await fetchMenu('main')
const navLinks = mainMenu.value.map((menuItem) => ({
  label: menuItem.title,
  to: menuItem.external
    ? menuItem.absolute
    : `/${menuItem.alias}${menuItem.options?.fragment ? `#${menuItem.options.fragment}` : ''}`,
}))

// Scroll behavior state
const { y } = useWindowScroll()
const lastScrollPosition = ref(0)
const showNavbar = ref(true)
const navbarOpen = ref(false)
const isScrolled = computed(() => y.value > 50)
const isOpen = ref(false) // Controls mobile menu slideover

// Scroll behavior logic
const handleScroll = useThrottleFn(() => {
  if (y.value < 0 || Math.abs(y.value - lastScrollPosition.value) < 40) return
  showNavbar.value = y.value < lastScrollPosition.value
  lastScrollPosition.value = y.value
  navbarOpen.value = false
}, 100)

// Watch scroll position
watch(y, handleScroll)

// On mount, check if there's a hash in the URL
onMounted(() => {
  if (route.hash) isScrolled.value = true
})
</script>

<template>
  <nav
    aria-label="Site navigation"
    role="navigation"
    :class="[
      theme.navigation.base,
      theme.navigation.transparentTop && !isScrolled && !isAdministrator
        ? ''
        : theme.navigation.background,
      {
        '-translate-y-full':
          !showNavbar || (theme.navigation.isHidden && !isScrolled),
      },
    ]"
  >
    <div
      :class="`${theme.container} mx-auto flex flex-wrap items-center justify-between`"
    >
      <div class="order-1">
        <ULink aria-label="Site Logo" class="font-bold" to="/">
          <template v-if="theme.navigation.logo">
            <AppLogo />
          </template>
          <template v-else>
            {{ page.site_info?.name }}
          </template>
        </ULink>
      </div>

      <UNavigationMenu
        :highlight="theme.navigation.highlight.show"
        :highlight-color="
          theme.navigation.highlight.show
            ? theme.navigation.highlight.color
            : ''
        "
        :color="theme.navigation.color"
        :variant="theme.navigation.variant"
        :class="[
          'order-2 hidden md:block',
          appConfig.colorMode?.forced ? 'ml-auto' : '',
        ]"
        :items="navLinks"
      />

      <div class="order-2 flex md:order-3">
        <IconsColorMode />
        <UButton
          aria-label="Site navigation toggle"
          class="md:hidden"
          color="black"
          :icon="
            isOpen ? 'i-heroicons-x-mark-solid' : 'i-heroicons-bars-3-solid'
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
        v-if="theme.navigation.slideover.logo"
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
        :ui="{ link: theme.navigation.slideover.link }"
        orientation="vertical"
        :items="navLinks"
      />
    </template>
  </USlideover>
</template>
