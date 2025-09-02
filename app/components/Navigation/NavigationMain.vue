<script lang="ts" setup>
import { useScrollNav } from '~/composables/useScrollNav'
import { usePageContext } from '~/composables/usePageContext'
const { scrollDirection, atBottom, isScrolled } = useScrollNav()

const { page, isFront } = usePageContext()
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

// Mobile nav toggle
const isOpen = ref(false)

// Optional: Override isScrolled on hash load
const forceScrolled = ref(false)
onMounted(() => {
  if (route.hash) forceScrolled.value = true
})
const finalIsScrolled = computed(() => isScrolled.value || forceScrolled.value)
</script>

<template>
  <nav
    aria-label="Site navigation"
    :class="[
      theme.navigation.base,
      theme.navigation.transparentTop && !finalIsScrolled
        ? ''
        : theme.navigation.background,
      {
        '-translate-y-full':
          (isFront && !finalIsScrolled && theme.navigation.isHidden) ||
          (finalIsScrolled && scrollDirection === 'down' && !atBottom),
      },
    ]"
    role="navigation"
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
        :class="[
          'order-2 hidden md:block',
          appConfig.colorMode?.forced ? 'ml-auto' : '',
        ]"
        :color="theme.navigation.color"
        :highlight="theme.navigation.highlight.show"
        :highlight-color="
          theme.navigation.highlight.show
            ? theme.navigation.highlight.color
            : ''
        "
        :items="navLinks"
        :variant="theme.navigation.variant"
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
    description="Navigation links for mobile menu"
    title="Site navigation"
    :ui="{
      header: 'flex items-center justify-between gap-1.5 p-4 sm:px-6 min-h-16',
      title: 'sr-only',
      description: 'sr-only',
      body: theme.navigation.slideover.body,
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
        :items="navLinks"
        orientation="vertical"
        :ui="{ link: theme.navigation.slideover.link }"
      >
        <template #item="{ item }">
          <ULink :to="item.to" @click="isOpen = false">
            {{ item.label }}
          </ULink>
        </template>
      </UNavigationMenu>
    </template>
  </USlideover>
</template>
