<template>
  <UNavigationMenu
    v-if="!isAdministrator"
    content-orientation="vertical"
    highlight
    highlight-color="primary"
    :items="links"
    :ui="{
      root: 'sticky top-0 z-60 h-[3.1rem] w-full bg-elevated px-4 py-1 shadow',
      link: 'text-xs',
      linkLabel: 'hidden md:block',
      linkLeadingIcon: 'text-white',
    }"
  >
    <!-- RIGHT SIDE: color switch + account -->
    <template #list-trailing>
      <div class="flex items-center gap-3">
        <!-- COLOR MODE SWITCH -->
        <ClientOnly>
          <UColorModeButton
            size="sm"
            :ui="{ icon: 'text-white', thumb: 'bg-white' }"
          >
            <template #fallback>
              <UButton loading variant="ghost" color="neutral" />
            </template>
          </UColorModeButton>
        </ClientOnly>

        <!-- ACCOUNT DROPDOWN -->
        <UDropdown :items="[accountMenu]" :ui="{ button: 'text-white' }">
          <UButton
            variant="ghost"
            color="neutral"
            icon="i-lucide-user"
            class="text-white"
          />
        </UDropdown>
      </div>
    </template>
  </UNavigationMenu>
</template>
