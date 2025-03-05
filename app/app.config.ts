export default defineAppConfig({
  colorMode: {
    forced: false,
    preference: 'dark',
  },
  stirTheme: {
    // loadingIndicator:
    // 'repeating-linear-gradient(to right,#D21B18 0%,#ED6663 50%,#F28E8D 100%)',
    crumbs: false,
    h1: 'mb-20 text-center text-6xl',
    header: 'md:px-auto fixed top-0 z-30 w-full',
    navigation: {
      logo: true,
      isHidden: false,
      transparentTop: false,
      base: 'transform py-3 duration-500',
      background: 'bg-white/90 shadow backdrop-blur-md dark:bg-gray-950/70',
      color: 'primary',
      variant: 'link',
      highlight: {
        show: false,
        color: 'primary',
      },
      slideover: {
        logo: true,
        link: 'text-xl text-center block my-3',
      },
    },
    main: 'pt-[10rem]',
    container: 'max-w-(--ui-container) mx-auto px-4 md:px-5 lg:px-8',
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
