type FormErrorEvent = {
  errors: { id: string; message?: string }[]
}

export const useValidation = () => {
  const toast = useToast()

  const onError = (event: FormErrorEvent) => {
    if (!import.meta.client) return
    if (!event?.errors?.length) return

    const firstError = event.errors[0]
    const element = document.getElementById(firstError.id)

    if (element) {
      element.focus()
      element.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }

    toast.add({
      title: 'Form Incomplete',
      description: 'Some required fields are missing or incorrect.',
      color: 'error',
    })
  }

  return { onError }
}
