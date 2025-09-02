export function useIntersectionObserver() {
  let observer: IntersectionObserver | null = null

  const observeVideos = (threshold: number = 0.1) => {
    if (!import.meta.client) return

    const videoElements = document.querySelectorAll(
      'video',
    ) as NodeListOf<HTMLVideoElement>

    if (videoElements.length === 0) return

    // Create a new IntersectionObserver instance
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

    // Start observing all video elements
    videoElements.forEach((videoElement) => observer?.observe(videoElement))
  }

  const disconnectObserver = () => {
    if (observer) {
      observer.disconnect()
      observer = null
    }
  }

  // Ensure cleanup happens when the component is unmounted
  onBeforeUnmount(() => {
    disconnectObserver()
  })

  return { observeVideos, disconnectObserver }
}
