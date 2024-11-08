export const aspectRatios = (width: number | null, height: number | null) => {
  if (width && height) {
	if (height === 480) {
	  return 'aspect-[4/3]'
	}
	const ratio = width / height
	if (ratio > 1) {
	  return 'aspect-[16/9]'
	} else if (ratio < 1) {
	  return 'aspect-[9/16]'
	} else {
	  return 'aspect-square'
	}
  }
  return ''
}
