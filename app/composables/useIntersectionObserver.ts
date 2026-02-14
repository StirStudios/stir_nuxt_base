export function useIntersectionObserver() {
  let observer: IntersectionObserver | null = null
  const observeVideos = (threshold: number = 0.1) => {
    if (!import.meta.client) return
    if (observer) {
      observer.disconnect()
      observer = null
    }

    const videoElements = document.querySelectorAll(
      'video',
    ) as NodeListOf<HTMLVideoElement>

    if (videoElements.length === 0) return

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const videoElement = entry.target as HTMLVideoElement
          if (entry.isIntersecting) {
            videoElement.play()
          } else {
            videoElement.pause()
          }
        })
      },
      { threshold },
    )

    videoElements.forEach((videoElement) => observer?.observe(videoElement))
  }

  const disconnectObserver = () => {
    if (observer) {
      observer.disconnect()
      observer = null
    }
  }

  onBeforeUnmount(() => {
    disconnectObserver()
  })

  return { observeVideos, disconnectObserver }
}
