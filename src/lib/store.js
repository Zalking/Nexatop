import { computed, reactive, watch } from 'vue'
import { games as baseGames, gameMeta, rupiah } from '../data/games'
import { vouchers as baseVouchers, paymentMethods, seedUsers } from '../data/extras'

const read = (key, fallback) => {
  try {
    const v = localStorage.getItem(key)
    return v ? JSON.parse(v) : fallback
  } catch {
    return fallback
  }
}
const write = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

export const state = reactive({
  orders: read('nexatop_orders', []), // kunci lama dipertahankan agar pesanan lama tetap muncul
  vouchers: read('nexatop_vouchers', baseVouchers),
  users: read('nexatop_users', seedUsers),
  session: read('nexatop_session', null),
  gameEdits: read('nexatop_game_edits', {}), // { [id]: { name, active, nominals } }
  customGames: read('nexatop_custom_games', []),
  settings: read('nexatop_settings', { notifEmail: true, notifWa: true, promo: false, lang: 'id' }),
  draft: { gameId: '', nominalLabel: '', playerId: '', zoneId: '', buyer: '', contact: '', voucher: '', method: 'bca' },
  toast: '',
})

let toastTimer
export function notify(message) {
  state.toast = message
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => (state.toast = ''), 3200)
}

let persistWarned = false
const persist = (key, getter) =>
  watch(getter, (v) => {
    if (!write(key, v) && !persistWarned) {
      persistWarned = true
      notify('Penyimpanan browser penuh. Coba gambar bukti yang lebih kecil.')
    }
  }, { deep: true })
persist('nexatop_orders', () => state.orders)
persist('nexatop_vouchers', () => state.vouchers)
persist('nexatop_users', () => state.users)
persist('nexatop_session', () => state.session)
persist('nexatop_game_edits', () => state.gameEdits)
persist('nexatop_custom_games', () => state.customGames)
persist('nexatop_settings', () => state.settings)

// ---------- Game & produk ----------
const coverFor = (name) => {
  const letter = encodeURIComponent((name || '?').trim().charAt(0).toUpperCase())
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 360'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop stop-color='%237257ff'/><stop offset='1' stop-color='%2312c6e8'/></linearGradient></defs><rect width='640' height='360' fill='%230b1020'/><rect width='640' height='360' fill='url(%23g)' opacity='.55'/><text x='320' y='235' font-size='190' font-family='Arial' font-weight='900' fill='white' fill-opacity='.9' text-anchor='middle'>${letter}</text></svg>`
  return `data:image/svg+xml;utf8,${svg}`
}

export const allGames = computed(() => {
  const base = baseGames.map((g) => {
    const edit = state.gameEdits[g.id] || {}
    return {
      ...g,
      ...gameMeta[g.id],
      name: edit.name ?? g.name,
      active: edit.active ?? true,
      nominals: edit.nominals ?? g.nominals,
    }
  })
  const custom = state.customGames.map((g) => ({
    needsZone: false, popular: false, rating: 4.6, sold: 'Baru', platforms: ['mobile'], tag: 'BARU', desc: 'Game baru di NexaTop.',
    ...g, image: coverFor(g.name), active: state.gameEdits[g.id]?.active ?? g.active ?? true,
    nominals: state.gameEdits[g.id]?.nominals ?? g.nominals,
  }))
  return [...base, ...custom]
})
export const games = computed(() => allGames.value.filter((g) => g.active))
export const gameById = (id) => allGames.value.find((g) => g.id === id)

export function saveGameEdit(id, patch) {
  state.gameEdits[id] = { ...(state.gameEdits[id] || {}), ...patch }
}
export function addCustomGame({ name, category, currency, needsZone }) {
  const id = 'c' + Date.now().toString(36)
  state.customGames.push({ id, name, category: category || 'Game · ' + currency, currency, needsZone, active: true, nominals: [{ label: '100 ' + currency, price: 25000 }] })
  return id
}

// ---------- Voucher ----------
export function evaluateVoucher(code, game, subtotal) {
  const c = String(code || '').trim().toUpperCase()
  if (!c) return { ok: false, reason: 'Masukkan kode voucher.' }
  const v = state.vouchers.find((x) => x.code === c)
  if (!v) return { ok: false, reason: 'Kode voucher tidak ditemukan.' }
  if (!v.active) return { ok: false, reason: 'Voucher sedang tidak aktif.' }
  if (v.expires && new Date(v.expires + 'T23:59:59') < new Date()) return { ok: false, reason: 'Voucher sudah kedaluwarsa.' }
  if (v.games?.length && (!game || !v.games.includes(game.id))) return { ok: false, reason: 'Voucher tidak berlaku untuk game ini.' }
  if (subtotal < v.min) return { ok: false, reason: `Minimal belanja ${rupiah(v.min)}.` }
  if (v.firstOrder && state.orders.length > 0) return { ok: false, reason: 'Voucher hanya untuk pesanan pertama.' }
  const raw = v.type === 'percent' ? Math.round((subtotal * v.value) / 100) : v.value
  const discount = Math.min(raw, v.max || raw, subtotal)
  return { ok: true, voucher: v, discount }
}

// ---------- Draft / checkout ----------
export const draftGame = computed(() => gameById(state.draft.gameId))
export const draftNominal = computed(() => draftGame.value?.nominals.find((n) => n.label === state.draft.nominalLabel) || null)
export const draftMethod = computed(() => paymentMethods.find((m) => m.id === state.draft.method) || paymentMethods[0])
export const draftPricing = computed(() => {
  const subtotal = draftNominal.value?.price || 0
  const res = state.draft.voucher && subtotal ? evaluateVoucher(state.draft.voucher, draftGame.value, subtotal) : null
  const discount = res?.ok ? res.discount : 0
  const fee = subtotal ? draftMethod.value.fee : 0
  return { subtotal, discount, fee, total: Math.max(0, subtotal - discount + fee), voucherOk: !!res?.ok, voucherMsg: res && !res.ok ? res.reason : '' }
})
export function startDraft(gameId) {
  if (state.draft.gameId !== gameId) {
    state.draft.gameId = gameId
    state.draft.nominalLabel = ''
    state.draft.zoneId = ''
    state.draft.voucher = ''
  }
}
export function resetDraft() {
  state.draft = { gameId: '', nominalLabel: '', playerId: '', zoneId: '', buyer: '', contact: '', voucher: '', method: 'bca' }
}

// ---------- Pesanan ----------
const event = (status, label) => ({ status, label, at: new Date().toLocaleString('id-ID'), ts: Date.now() })
export function createOrder(proof) {
  const g = draftGame.value, n = draftNominal.value, p = draftPricing.value, d = state.draft
  const order = {
    id: 'NX' + Date.now().toString().slice(-8),
    createdAt: new Date().toLocaleString('id-ID'),
    ts: Date.now(),
    gameId: g.id, game: g.name, nominal: n.label, price: n.price,
    discount: p.discount, fee: p.fee, total: p.total,
    voucher: p.voucherOk ? d.voucher.trim().toUpperCase() : '',
    method: draftMethod.value.name,
    playerId: d.playerId.trim(), zoneId: d.zoneId.trim(),
    buyer: d.buyer.trim(), contact: d.contact.trim(),
    userId: state.session?.id || '',
    proof, status: 'pending',
    timeline: [event('pending', 'Pesanan dibuat, menunggu verifikasi pembayaran')],
  }
  state.orders.unshift(order)
  return order
}
export const orderTotal = (o) => o.total ?? o.price // pesanan lama belum punya total
export function setOrderStatus(id, status, label) {
  const o = state.orders.find((x) => x.id === id)
  if (!o) return false
  o.status = status
  o.timeline = [...(o.timeline || []), event(status, label || '')]
  return true
}
export const myOrders = computed(() =>
  state.session ? state.orders.filter((o) => !o.userId || o.userId === state.session.id) : state.orders,
)

// ---------- Akun ----------
export function register({ name, email, phone }) {
  const e = email.trim().toLowerCase()
  if (state.users.some((u) => u.email.toLowerCase() === e)) return { ok: false, reason: 'Email sudah terdaftar. Silakan masuk.' }
  const user = { id: 'u' + Date.now().toString(36), name: name.trim(), email: e, phone: phone.trim(), role: 'user', joinedAt: new Date().toISOString().slice(0, 10), status: 'active' }
  state.users.push(user)
  state.session = { ...user }
  return { ok: true }
}
export function login(email) {
  const u = state.users.find((x) => x.email.toLowerCase() === email.trim().toLowerCase())
  if (!u) return { ok: false, reason: 'Akun tidak ditemukan. Daftar dulu atau coba raka@example.com.' }
  if (u.status === 'blocked') return { ok: false, reason: 'Akun ini diblokir. Hubungi bantuan.' }
  state.session = { ...u }
  return { ok: true }
}
export function logout() { state.session = null }
export function updateProfile(patch) {
  Object.assign(state.session, patch)
  const u = state.users.find((x) => x.id === state.session.id)
  if (u) Object.assign(u, patch)
}

// ---------- Data demo untuk laporan admin ----------
export function seedDemoOrders() {
  const names = ['Raka Pratama', 'Salsa Nabila', 'Dimas Aditya', 'Putri Anjani', 'Bima Saputra', 'Nadia Rahma']
  const statuses = ['done', 'done', 'done', 'paid', 'pending', 'rejected', 'done']
  const demo = []
  for (let i = 0; i < 28; i++) {
    const g = baseGames[(i * 3 + 1) % baseGames.length]
    const n = g.nominals[(i * 2) % 4]
    const ts = Date.now() - Math.floor((i / 28) * 13 * 86400000) - i * 1000 * 60 * 17
    const status = statuses[i % statuses.length]
    demo.push({
      id: 'DM' + String(10000000 + i * 7919).slice(-8), createdAt: new Date(ts).toLocaleString('id-ID'), ts,
      gameId: g.id, game: g.name, nominal: n.label, price: n.price, discount: 0, fee: 0, total: n.price,
      voucher: '', method: 'Bank Nexa (BCA demo)', playerId: String(40000000 + i * 313), zoneId: g.needsZone ? String(2000 + i) : '',
      buyer: names[i % names.length], contact: '08' + (1200000000 + i * 4411), userId: '', proof: '', demo: true, status,
      timeline: [event('pending', 'Pesanan dibuat (data demo)')],
    })
  }
  state.orders.push(...demo)
}
export function clearDemoOrders() { state.orders = state.orders.filter((o) => !o.demo) }
