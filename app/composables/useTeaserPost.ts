export function useTeaserPost(
  input: unknown,
  extra: {
    title?: string
    nid?: string
    url?: string
    created?: string
    orientation?: 'horizontal' | 'vertical'
  } = {},
) {
  const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === 'object' && value !== null

  const teaserSource = computed(() => {
    const source = isRecord(input) && 'value' in input ? input.value : input
    const raw = isRecord(source) ? source : {}
    const props = isRecord(raw.props) ? raw.props : {}
    const media = isRecord(raw.media) ? raw.media : {}
    const text = typeof raw.text === 'string' ? raw.text : ''
    return {
      props,
      media,
      text,
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
    editLink: extra.nid ? `/node/${extra.nid}/edit` : undefined,
  }))

  return { teaser: teaserSource, image, post, orientation }
}
