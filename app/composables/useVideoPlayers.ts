import type { VideoPlayer } from '~/types/MediaTypes'

export function useVideoPlayers() {
  const videoPlayers = ref<Map<string, VideoPlayer>>(new Map())
  const isScriptLoaded = ref(false)

  useHead({
    script: [
      {
        src: '//assets.mediadelivery.net/playerjs/player-0.1.0.min.js',
        defer: true,
        onload: () => {
          isScriptLoaded.value = true
        },
      },
    ],
  })

  watch(isScriptLoaded, (loaded: boolean) => {
    if (loaded) {
      initializePlayers()
    }
  })

  async function initializePlayers() {
    await nextTick()

    const iframes = document.querySelectorAll('iframe[data-mid]')
    iframes.forEach((iframe) => {
      const iframeKey = iframe.getAttribute('data-mid')
      if (!iframeKey || videoPlayers.value.has(iframeKey)) return

      try {
        const player: VideoPlayer = new window.playerjs.Player(
          iframe as HTMLIFrameElement,
        )
        playersReady(iframeKey, player) // Check readiness for the specific player
      } catch (error) {
        console.error(`Error initializing player for ${iframeKey}:`, error)
      }
    })
  }

  // Modularized playersReady function for single-player handling
  function playersReady(iframeKey: string, player: VideoPlayer): void {
    player.on('ready', () => {
      videoPlayers.value.set(iframeKey, player)
      addFullscreenExitOnEnd()
      resetOnEnd(iframeKey, player)
    })
  }

  function resetOnEnd(_iframeKey: string, player: VideoPlayer): void {
    player.on('ended', () => {
      player.setCurrentTime(0)
      player.pause()
    })
  }

  function addEventToAllPlayers(event: string, callback: () => void): void {
    videoPlayers.value.forEach((player: VideoPlayer) => {
      if (player.isReady && player.supports('event', event)) {
        player.on(event, callback)
      }
    })
  }

  function playAllPlayers(): void {
    videoPlayers.value.forEach((player: VideoPlayer) => {
      if (player.isReady && player.supports('method', 'play')) {
        player.play()
      }
    })
  }

  function pauseAllPlayers(): void {
    videoPlayers.value.forEach((player: VideoPlayer) => {
      if (player.isReady && player.supports('method', 'pause')) {
        player.pause()
      }
    })
  }

  function addFullscreenExitOnEnd() {
    addEventToAllPlayers('ended', () => {
      if (document.fullscreenElement && 'exitFullscreen' in document) {
        document
          .exitFullscreen()
          .catch((err) => console.error('Error exiting fullscreen:', err))
      }
    })
  }

  function muteAllPlayers(): void {
    videoPlayers.value.forEach((player: VideoPlayer) => {
      if (player.isReady && player.supports('method', 'mute')) {
        player.mute()
      }
    })
  }

  function unmuteAllPlayers(): void {
    videoPlayers.value.forEach((player: VideoPlayer) => {
      if (player.isReady && player.supports('method', 'unmute')) {
        player.unmute()
      }
    })
  }

  function setVolumeForAll(value: number): void {
    videoPlayers.value.forEach((player: VideoPlayer) => {
      if (player.isReady && player.supports('method', 'setVolume')) {
        player.setVolume(value)
      }
    })
  }

  function seekAllPlayers(timeInSeconds: number): void {
    videoPlayers.value.forEach((player: VideoPlayer) => {
      if (player.isReady && player.supports('method', 'setCurrentTime')) {
        player.setCurrentTime(timeInSeconds)
      }
    })
  }

  return {
    initializePlayers,
    playersReady,
    addEventToAllPlayers,
    playAllPlayers,
    pauseAllPlayers,
    addFullscreenExitOnEnd,
    muteAllPlayers,
    unmuteAllPlayers,
    setVolumeForAll,
    seekAllPlayers,
    videoPlayers,
  }
}
