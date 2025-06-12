export function useUserwayWidget() {
  if (!import.meta.client) return

  const appConfig = useAppConfig()
  const cfg = appConfig.userway

  if (!cfg?.enabled || !cfg.account) return

  onMounted(() => {
    window._userway_config = {
      account: cfg.account,
      position: cfg.position ?? 3,
      size: cfg.size ?? 'small',
      color: cfg.color ?? '#ffffff',
      type: cfg.type ?? '1',
    }

    useScript({
      src: 'https://cdn.userway.org/widget.js',
      crossorigin: 'anonymous',
      referrerpolicy: 'no-referrer',
    })
  })
}
