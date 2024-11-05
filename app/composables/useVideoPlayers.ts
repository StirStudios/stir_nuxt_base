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

  watch(isScriptLoaded, (loaded) => {
    if (loaded) {
      initializePlayers()
    }
  })

  async function initializePlayers() {
    await nextTick()

    const iframes = document.querySelectorAll('iframe')
    iframes.forEach((iframe, index) => {
      const iframeKey = `iframe-${index}`
      if (!videoPlayers.value.has(iframeKey)) {
        try {
          const player: VideoPlayer = new (window as any).playerjs.Player(
            iframe,
          )
          player.on('ready', () => {
            videoPlayers.value.set(iframeKey, player)
            addFullscreenExitOnEnd()
          })
        } catch (error) {}
      }
    })
  }

  function playersReady(callback: () => void) {
    videoPlayers.value.forEach((player) => {
      if (player.isReady) {
        callback()
      } else {
        player.on('ready', callback)
      }
    })
  }

  function addEventToAllPlayers(event: string, callback: () => void) {
    videoPlayers.value.forEach((player) => {
      if (player.isReady && player.supports('event', event)) {
        player.on(event, callback)
      }
    })
  }

  function playAllPlayers() {
    videoPlayers.value.forEach((player) => {
      if (player.isReady && player.supports('method', 'play')) {
        player.play()
      }
    })
  }

  function pauseAllPlayers() {
    videoPlayers.value.forEach((player) => {
      if (player.isReady && player.supports('method', 'pause')) {
        player.pause()
      }
    })
  }

  function addFullscreenExitOnEnd() {
    addEventToAllPlayers('ended', () => {
      if (document.fullscreenElement && 'exitFullscreen' in document) {
        document.exitFullscreen().catch((err) => {})
      }
    })
  }

  function muteAllPlayers() {
    videoPlayers.value.forEach((player) => {
      if (player.isReady && player.supports('method', 'mute')) {
        player.mute()
      }
    })
  }

  function unmuteAllPlayers() {
    videoPlayers.value.forEach((player) => {
      if (player.isReady && player.supports('method', 'unmute')) {
        player.unmute()
      }
    })
  }

  function setVolumeForAll(value: number) {
    videoPlayers.value.forEach((player) => {
      if (player.isReady && player.supports('method', 'setVolume')) {
        player.setVolume(value)
      }
    })
  }

  function seekAllPlayers(timeInSeconds: number) {
    videoPlayers.value.forEach((player) => {
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
