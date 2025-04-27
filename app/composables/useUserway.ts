export function useUserwayWidget() {
  if (import.meta.client) {
    onMounted(() => {
      window._userway_config = {
        account: '2uZAEYYvsx',
        position: 3,
        size: 'small',
        color: '#ffffff',
        type: '1',
      }

      useScript({
        src: 'https://cdn.userway.org/widget.js',
        crossorigin: 'anonymous',
        referrerPolicy: 'no-referrer',
      })
    })
  }
}
