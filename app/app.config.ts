export default defineAppConfig({
  colorMode: {
    forced: false,
    preference: 'dark',
  },
  stirTheme: {
    crumbs: false,
    h1: 'mb-20 text-center text-6xl',
    header: 'md:px-auto fixed top-0 z-30 w-full',
    navigation:
      'transform bg-white/90 py-3 shadow backdrop-blur-md duration-500 dark:bg-gray-950/70',
    main: 'pt-[10rem]',
    footer: 'mt-20 bg-gray-100 py-10 text-sm dark:bg-black',
    mediaRounded: 'rounded-xl',
    aspectRatios: {
      portrait: 'aspect-[9/16]',
      landscape: 'aspect-[16/9]',
      square: 'aspect-square',
      fourThree: 'aspect-[4/3]',
    },
    grid: {
      cols: {
        one_column: 'sm:grid-cols-1 lg:grid-cols-1',
        two_column: 'sm:grid-cols-1 lg:grid-cols-2',
        three_column: 'sm:grid-cols-2 lg:grid-cols-3',
        four_column: 'sm:grid-cols-2 lg:grid-cols-4',
      },
      viewCols: {
        2: 'sm:grid-cols-2',
        3: 'sm:grid-cols-2 md:grid-cols-3',
        4: 'sm:grid-cols-2 md:grid-cols-4',
        5: 'sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5',
      },
      wrapCols: 'grid gap-5 lg:gap-10 xl:gap-16 grid-cols-2 lg:grid-cols-4',
      container: 'mx-auto container px-4 md:px-5',
      gap: 'gap-4 md:gap-6 lg:gap-10',
      viewGap: 'gap-5 lg:gap-10 xl:gap-16',
    },
    gradients: {
      1: 'bg-gradient-to-tr from-[#f35b0f] to-[#6b4ef2]',
      2: 'bg-gradient-to-r from-[#ff7f50] to-[#1e90ff]',
      3: 'bg-gradient-to-b from-[#7b2ff7] to-[#e53e3e]',
    },
    carousel: {
      padding: 'p-8 px-16 pb-12',
      root: '',
    },
    webform: {
      form: 'mx-auto space-y-8 md:max-w-lg',
      fieldGroupHeader: 'mb-6 text-xl font-semibold',
      fieldGroup: '',
      response: 'mx-auto space-y-8 text-center md:max-w-lg',
    },
    scrollButton: {
      base: 'fixed bottom-4 left-4 z-50 rounded-full p-2 text-white shadow-md transition-opacity duration-300',
      icon: 'i-heroicons:arrow-up',
      variant: 'solid',
      showAtScrollY: 200,
    },
  },
  ui: {
    colors: {
      primary: 'lime',
      neutral: 'zinc',
    },
    // navigationMenu: {
    //   slots: {
    //     link: 'font-medium text-md',
    //   },
    //   variants: {
    //     active: {
    //       false: {
    //         link: 'text-(--ui-text-highlighted)',
    //       },
    //     },
    //   },
    //   compoundVariants: [
    //     {
    //       color: 'primary',
    //       variant: 'pill',
    //       active: true,
    //       class: {
    //         link: 'text-(--ui-highlighted)',
    //       },
    //     },
    //     {
    //       variant: 'pill',
    //       active: true,
    //       highlight: false,
    //       class: {
    //         link: 'before:bg-transparent hover:bg-(--ui-bg-elevated) hover:text-(--ui-highlighted)',
    //       },
    //     },
    //   ],
    // },
    button: {
      slots: {
        base: 'transition-all duration-300',
      },
      // variants: {
      //   size: {
      //     lg: {
      //       leadingIcon: 'size-6',
      //       trailingIcon: 'size-6',
      //     },
      //     xl: {
      //       base: 'px-6 py-3 text-md gap-2',
      //       leadingIcon: 'size-8',
      //       trailingIcon: 'size-8',
      //     },
      //   },
      // },
      defaultVariants: {
        // color: 'primary',
        // variant: 'solid',
        size: 'xl',
      },
    },
    // slideover: {
    //   variants: {
    //     side: {
    //       right: {
    //         content: 'right-0 inset-y-0 w-full max-w-full',
    //       },
    //     },
    //   },
    // },
    formField: {
      slots: {
        labelWrapper: 'block text-sm/6 font-medium',
        container: 'mt-2',
        error: 'mt-2 text-[var(--ui-error)]',
      },
    },
    // carousel: {
    //   variants: {
    //     orientation: {
    //       horizontal: {
    //         item: 'ps-0',
    //         prev: '-start-12 top-1/2 -translate-y-1/2',
    //         next: '-end-12 top-1/2 -translate-y-1/2',
    //       },
    //     },
    //   },
    // },
  },
})
