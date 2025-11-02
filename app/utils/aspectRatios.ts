/**
 * Returns Tailwind aspect ratio + max-height utility classes
 * based on image width/height or theme config.
 *
 * Example output:
 *  - "aspect-[9/16] max-h-[40%]"
 *  - "aspect-[16/9] max-h-[30%]"
 */
export const aspectRatios = (
  width: number | null,
  height: number | null,
  options?: {
    portraitMax?: string
    landscapeMax?: string
    squareMax?: string
    fourThreeMax?: string
  },
) => {
  const appConfig = useAppConfig?.()
  const ratioConfig = appConfig?.stirTheme?.aspectRatios || {}

  const defaults = {
    portrait: 'aspect-[9/16]',
    landscape: 'aspect-[16/9]',
    square: 'aspect-square',
    fourThree: 'aspect-[4/3]',
  }

  const portraitRatio = ratioConfig.portrait || defaults.portrait
  const landscapeRatio = ratioConfig.landscape || defaults.landscape
  const squareRatio = ratioConfig.square || defaults.square
  const fourThreeRatio = ratioConfig.fourThree || defaults.fourThree

  const portraitMax = options?.portraitMax || 'max-h-[40%]'
  const landscapeMax = options?.landscapeMax || 'max-h-[30%]'
  const squareMax = options?.squareMax || 'max-h-[35%]'
  const fourThreeMax = options?.fourThreeMax || 'max-h-[30%]'

  if (width && height) {
    const ratio = width / height

    if (height === 480) {
      return `${fourThreeRatio} ${fourThreeMax}`
    }
    if (ratio > 1) {
      return `${landscapeRatio} ${landscapeMax}`
    }
    if (ratio < 1) {
      return `${portraitRatio} ${portraitMax}`
    }
    return `${squareRatio} ${squareMax}`
  }

  return ''
}
