export const aspectRatios = (width: number | null, height: number | null) => {
  const appConfig = useAppConfig()
  const aspectRatioConfig = appConfig?.stirTheme?.aspectRatios || {}

  // Define default aspect ratios as a fallback
  const defaultRatios = {
	portrait: 'aspect-[9/16]',
	landscape: 'aspect-[16/9]',
	square: 'aspect-square',
	fourThree: 'aspect-[4/3]',
  }

  // Fallback to defaults if config values are missing
  const portrait = aspectRatioConfig.portrait || defaultRatios.portrait
  const landscape = aspectRatioConfig.landscape || defaultRatios.landscape
  const square = aspectRatioConfig.square || defaultRatios.square
  const fourThree = aspectRatioConfig.fourThree || defaultRatios.fourThree

  if (width && height) {
	if (height === 480) {
	  return fourThree
	}
	const ratio = width / height
	if (ratio > 1) {
	  return landscape
	} else if (ratio < 1) {
	  return portrait
	} else {
	  return square
	}
  }
  return ''
}
