export default defineAppConfig({
  ui: {
    // strategy: 'override',
    primary: 'lime',
    gray: 'zinc',
    button: {
      base: 'transition-all duration-300',
      size: {
        '2xs': 'text-xs',
        xs: 'text-xs',
        sm: 'text-sm',
        md: 'text-md',
        lg: 'text-lg',
        xl: 'text-2xl',
      },
      rounded: '',
      padding: {
        // 2xs: 'px-2 py-1',
        // xs: 'px-2.5 py-1.5',
        // sm: 'px-2.5 py-1.5',
        // md: 'px-3 py-2',
        // lg: 'px-3.5 py-2.5',
        // xl: 'px-3.5 py-2.5',
      },
      default: {
        // size: 'lg',
        // variant: 'solid',
        // color: 'primary',
        // loadingIcon: 'i-heroicons-arrow-path-20-solid',
      },
    },
    card: {
      // background: 'bg-black',
      // ring: 'ring-black',
    },
    slideover: {
      // width: 'w-screen max-w-full',
    },
    formGroup: {
      default: {
        size: 'xl',
      },
    },
    // tooltip: {
    //   background: 'bg-white dark:bg-white',
    //   color: 'text-black dark:text-black',
    // },
  },
})
