<template>
  <div class="transition">
    <NuxtLoadingIndicator />
    <a
      href="#main-content"
      class="absolute top-0 left-0 -translate-y-full focus:translate-y-2 focus:left-1/2 focus:-translate-x-1/2 z-50 bg-black bg-opacity-60 text-white text-sm leading-relaxed px-4 py-2 rounded-b-md focus:outline-none"
    >
      Skip to main content
    </a>
    <NavigationMain />
    <NuxtPage />
    <UNotifications />
    <LazyAppScrollToTop />
  </div>
</template>

<style scroped>
.page-enter-active,
.page-leave-active {
  @apply transition-all duration-500;
}
.page-enter-from,
.page-leave-to {
  @apply opacity-0;
}
</style>
