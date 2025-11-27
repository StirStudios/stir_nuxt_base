export function useTeaserPost(
  input: unknown,
  extra: {
    title?: string
    url?: string
    created?: string
    orientation?: 'horizontal' | 'vertical'
  } = {},
) {
  // Always resolve actual data
  const teaserSource = computed(() => {
    const raw = input?.value ?? input ?? {}
    return {
      props: raw.props ?? {},
      media: raw.media ?? {},
      text: raw.text ?? '',
    }
  })

  const orientation = computed(() => extra.orientation ?? 'horizontal')

  const image = computed(() => {
    const m = teaserSource.value.media
    if (!m?.src) return null
    return {
      src: m.src,
      alt: m.alt ?? extra.title ?? '',
      width: m.width,
      height: m.height,
      srcset: m.srcset,
      sizes: m.sizes ?? '(min-width: 768px) 50vw, 100vw',
      loading: 'lazy',
      fetchpriority: 'low',
      decoding: 'async',
    }
  })

  const post = computed(() => ({
    title: extra.title ?? '',
    description: teaserSource.value.text ?? '',
    image: image.value,
    date: extra.created
      ? new Date(Number(extra.created) * 1000).toISOString().slice(0, 10)
      : '',
    to: extra.url ?? '',
    editLink: teaserSource.value.props?.editLink,
  }))

  return { teaser: teaserSource, image, post, orientation }
}
