type FormErrorEvent = {
  errors: { id: string; message?: string }[]
}

export const useValidation = () => {
  const toast = useToast()

  const onError = (event: FormErrorEvent) => {
    if (event?.errors?.[0]?.id) {
      const element = document.getElementById(event.errors[0].id)

      toast.add({
        title: 'Form Incomplete',
        description: 'Some required fields are missing or incorrect.',
        color: 'error',
      })

      element?.focus()
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  return { onError }
}
