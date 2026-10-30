<script setup>
import { computed, ref, watch } from 'vue'
import { statusLabel } from './data/games'
import { notify, setOrderStatus, state } from './lib/store'
import { go, href, route } from './lib/router'
import AdminDashboard from './components/AdminDashboard.vue'
import Icon from './components/Icon.vue'
import HomePage from './pages/HomePage.vue'
import GamesPage from './pages/GamesPage.vue'
import GameDetailPage from './pages/GameDetailPage.vue'
import CheckoutPage from './pages/CheckoutPage.vue'
import OrdersPage from './pages/OrdersPage.vue'
import OrderDetailPage from './pages/OrderDetailPage.vue'
import ProfilePage from './pages/ProfilePage.vue'
import LoginPage from './pages/LoginPage.vue'
import PromoPage from './pages/PromoPage.vue'
import HelpPage from './pages/HelpPage.vue'

const adminFilter = ref('all')
const menuOpen = ref(false)
const page = computed(() => route.value.segments[0] || 'home')
const isAdmin = computed(() => page.value === 'admin')
const views = {
  home: HomePage, games: GamesPage, game: GameDetailPage, checkout: CheckoutPage, orders: OrdersPage,
  order: OrderDetailPage, profile: ProfilePage, login: LoginPage, promo: PromoPage, help: HelpPage,
}
const view = computed(() => views[page.value] || HomePage)
const nav = [
  ['home', '', 'Beranda'], ['games', 'games', 'Game'], ['promo', 'promo', 'Promo'], ['orders', 'orders', 'Pesanan'], ['help', 'help', 'Bantuan'],
]
const activeNav = (id) => page.value === id || (id === 'games' && page.value === 'game') || (id === 'orders' && page.value === 'order')
const initials = computed(() => (state.session?.name || '').split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase())
watch(route, () => (menuOpen.value = false))

function updateStatus(id, status) {
  const label = { paid: 'Pembayaran diverifikasi admin', done: 'Top up berhasil dikirim ke akun game', rejected: 'Pesanan ditolak admin' }[status]
  if (setOrderStatus(id, status, label)) notify(`Status pesanan diperbarui: ${statusLabel(status)}`)
}
function viewProof(order) {
  if (!order.proof) return
  const win = window.open()
  if (!win) return notify('Popup diblokir browser. Izinkan popup untuk melihat bukti.')
  const img = win.document.createElement('img')
  img.src = order.proof
  img.alt = `Bukti pembayaran ${order.id}`
  img.style.cssText = 'max-width:100%;height:auto'
  win.document.title = `Bukti ${order.id}`
  win.document.body.appendChild(img)
}
</script>

<template>
  <div class="app-shell">
    <div class="utility-bar">
      <div class="shell utility-inner">
        <span class="follow">Ikuti kami
          <a href="https://www.instagram.com/nexatop" target="_blank" rel="noopener noreferrer" aria-label="Instagram NexaTop"><Icon name="instagram" :size="14" /></a>
          <a href="https://www.youtube.com/@nexatop" target="_blank" rel="noopener noreferrer" aria-label="YouTube NexaTop"><Icon name="youtube" :size="14" /></a>
          <a href="https://twitter.com/nexatop" target="_blank" rel="noopener noreferrer" aria-label="Twitter NexaTop"><Icon name="twitter" :size="14" /></a>
          <a href="https://www.twitch.tv/nexatop" target="_blank" rel="noopener noreferrer" aria-label="Twitch NexaTop"><Icon name="twitch" :size="14" /></a>
        </span>
        <a class="mail" href="mailto:infomail@gmail.com"><Icon name="mail" :size="13" /> infomail@gmail.com</a>
      </div>
    </div>
    <div class="shell">
      <header class="topbar">
        <button class="burger" :aria-expanded="menuOpen" aria-label="Menu" @click="menuOpen = !menuOpen"><Icon :name="menuOpen ? 'x' : 'menu'" :size="20" /></button>
        <a class="brand" :href="href('')">NEXA<span>TOP.</span></a>
        <nav class="nav" :class="{ open: menuOpen }" aria-label="Navigasi utama">
          <a v-for="[id, path, label] in nav" :key="id" :href="href(path)" :class="{ on: activeNav(id) }">{{ label }}</a>
        </nav>
        <div class="top-actions">
          <a v-if="!state.session" class="login-link" :href="href('login')"><Icon name="user" :size="16" /> <span>Masuk</span></a>
          <a v-else class="login-link" :href="href('profile')"><span class="avatar">{{ initials }}</span> <span>{{ state.session.name.split(' ')[0] }}</span></a>
          <button class="pill" :class="{ on: isAdmin }" @click="isAdmin ? go('') : go('admin')"><Icon name="settings" :size="14" /> <span>Admin Demo</span></button>
        </div>
      </header>

      <main>
        <AdminDashboard
          v-if="isAdmin"
          v-model:filter="adminFilter"
          :orders="state.orders"
          @back="go('')"
          @update-status="updateStatus"
          @view-proof="viewProof"
        />
        <component :is="view" v-else :key="page === 'game' ? route.segments.join('/') : page" />
      </main>

      <footer id="help" class="footer">
        <div class="footer-top">
          <div><a class="brand" :href="href('')">NEXA<span>TOP.</span></a><p class="muted">Top up game favorit dengan alur simpel dan ringkasan yang transparan.</p></div>
          <div class="footer-links"><b>Jelajahi</b><a :href="href('games')">Semua game</a><a :href="href('promo')">Voucher &amp; promo</a><a :href="href('orders')">Riwayat pesanan</a></div>
          <div class="footer-links"><b>Bantuan</b><a :href="href('help')">Pusat bantuan</a><a :href="href('help')">FAQ</a><a :href="href('profile')">Akun saya</a></div>
        </div>
        <div class="footer-bottom">
          <span>© 2026 NexaTop · Vue 3 + Vite</span>
          <span>Prototype frontend · Transaksi nyata memerlukan backend dan autentikasi aman.</span>
        </div>
      </footer>
    </div>
    <Transition name="toast"><div v-if="state.toast" class="toast" role="status">{{ state.toast }}</div></Transition>
  </div>
</template>
