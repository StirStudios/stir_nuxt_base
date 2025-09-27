<script lang="ts" setup>
import { useScrollNav } from '~/composables/useScrollNav'
import { usePageContext } from '~/composables/usePageContext'

const { scrollDirection, atBottom, isScrolled } = useScrollNav()
const { page, isFront, isAdministrator } = usePageContext()
const { fetchMenu } = useDrupalCe()
const route = useRoute()
const appConfig = useAppConfig()
const theme = appConfig.stirTheme

// Fetch menu items
const mainMenu = await fetchMenu('main')
const navLinks = mainMenu.value.map((item) => ({
  label: item.title,
  to: item.external
    ? item.absolute
    : `/${item.alias}${item.options?.fragment ? `#${item.options.fragment}` : ''}`,
}))

// Optional: Override isScrolled on hash load
const forceScrolled = ref(false)
onMounted(() => {
  if (route.hash) forceScrolled.value = true
})
const finalIsScrolled = computed(() => isScrolled.value || forceScrolled.value)
</script>

<template>
  <UHeader
    aria-label="Site header"
    :mode="theme.navigation.toggleType"
    :toggle-side="theme.navigation.toggleDirection"
    :ui="{
      root: [theme.header, 'bg-transparent backdrop-blur-none border-none'],
      container: [
        theme.container,
        'flex-wrap',
        theme.navigation.base,
        theme.navigation.transparentTop && !finalIsScrolled
          ? ''
          : theme.navigation.background,
        {
          '-translate-y-full':
            (isFront && !finalIsScrolled && theme.navigation.isHidden) ||
            (finalIsScrolled && scrollDirection === 'down' && !atBottom),
        },
      ],
      body: theme.navigation.slideover.body,
    }"
  >
    <template #top>
      <LazyDrupalTabs v-if="isAdministrator" />
    </template>

    <template #left>
      <ULink aria-label="Site Logo" to="/">
        <template v-if="theme.navigation.logo">
          <AppLogo class="h-6 w-auto" />
        </template>
        <template v-else>
          {{ page.site_info?.name }}
        </template>
      </ULink>
    </template>

    <UNavigationMenu
      class="hidden md:block"
      :class="appConfig.colorMode?.forced ? 'ml-auto' : ''"
      :color="theme.navigation.color"
      :highlight="theme.navigation.highlight.show"
      :highlight-color="theme.navigation.highlight.color"
      :items="navLinks"
      :variant="theme.navigation.variant"
    />

    <template #right>
      <IconsColorMode />
    </template>

    <template #body>
      <UNavigationMenu
        :items="navLinks"
        orientation="vertical"
        :ui="{ link: theme.navigation.slideover.link }"
      />
    </template>
  </UHeader>
</template>
