import { ref } from 'vue'

// Router hash minimalis (tanpa dependensi baru): #/game/ml, #/checkout, #/admin ...
function parse() {
  const raw = (location.hash || '').replace(/^#\/?/, '')
  const [path, qs] = raw.split('?')
  return {
    segments: path.split('/').filter(Boolean).map(decodeURIComponent),
    query: Object.fromEntries(new URLSearchParams(qs || '')),
  }
}
export const route = ref(parse())
if (typeof window !== 'undefined') {
  window.addEventListener('hashchange', () => {
    route.value = parse()
    window.scrollTo({ top: 0 })
  })
}
export const href = (path = '') => '#/' + String(path).replace(/^\//, '')
export const go = (path = '') => {
  location.hash = href(path)
}
