export default defineNuxtPlugin((nuxtApp) => {
  const toast = useToast()

  nuxtApp.vueApp.config.errorHandler = (error, instance, info) => {
    toast.add({
      title: 'Error',
      description: error,
      icon: 'i-octicon-desktop-download-24',
      color: 'red',
    })
  }
})
