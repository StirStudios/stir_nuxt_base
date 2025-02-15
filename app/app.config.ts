export default defineAppConfig({
  colorMode: {
    forced: false,
    preference: 'dark',
  },
  stirTheme: {
    crumbs: false,
    h1: 'mb-20 text-center text-6xl',
    main: 'pt-[10rem]',
    footer: 'mt-20 bg-gray-100 py-10 text-sm dark:bg-black',
    scrollButton: {
      base: 'fixed bottom-4 left-4 z-50 rounded-full p-2 text-white shadow-md transition-opacity duration-300',
      icon: 'i-heroicons:arrow-up',
      variant: 'solid',
      showAtScrollY: 200,
    },
  },
  ui: {
    // strategy: 'override',
    colors: {
      primary: 'lime',
      neutral: 'zinc',
    },
    button: {
      slots: {
        base: 'transition-all duration-300',
      },
      defaultVariants: {
        size: 'lg',
      },
    },
  },
})
