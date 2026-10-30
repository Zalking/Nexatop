<script setup>
import { computed, ref } from 'vue'
import { rupiah, statusLabel } from '../data/games'
import { clearDemoOrders, notify, orderTotal, seedDemoOrders, state } from '../lib/store'
import Icon from './Icon.vue'
import AdminGames from './admin/AdminGames.vue'
import AdminProducts from './admin/AdminProducts.vue'
import AdminUsers from './admin/AdminUsers.vue'
import AdminReports from './admin/AdminReports.vue'
import AdminVouchers from './admin/AdminVouchers.vue'

const props = defineProps({ orders: { type: Array, required: true } })
const emit = defineEmits(['back', 'update-status', 'view-proof'])
const filter = defineModel('filter', { default: 'all' })
const tab = ref('orders')
const q = ref('')
const tabs = [
  ['orders', 'Pesanan', 'package'],
  ['games', 'Game', 'grid'],
  ['products', 'Produk', 'tag'],
  ['users', 'Pengguna', 'users'],
  ['reports', 'Laporan', 'bar-chart-2'],
  ['vouchers', 'Voucher', 'gift'],
]
const visibleOrders = computed(() =>
  props.orders.filter((o) => (filter.value === 'all' || o.status === filter.value) && `${o.id} ${o.buyer} ${o.game}`.toLowerCase().includes(q.value.toLowerCase())),
)
const pending = computed(() => props.orders.filter((o) => o.status === 'pending').length)
const valid = computed(() => props.orders.filter((o) => o.status === 'paid' || o.status === 'done'))
const revenue = computed(() => valid.value.reduce((sum, order) => sum + orderTotal(order), 0))
const hasDemo = computed(() => props.orders.some((o) => o.demo))
function toggleDemo() {
  if (hasDemo.value) { clearDemoOrders(); notify('Data demo dihapus.') }
  else { seedDemoOrders(); notify('28 pesanan demo ditambahkan untuk laporan.') }
}
</script>

<template>
  <section class="admin-view">
    <div class="admin-top">
      <div><div class="eyebrow">PANEL OPERASIONAL</div><h1>Dashboard Admin</h1><p class="muted">Kelola game, produk, pesanan, pengguna, voucher, dan laporan.</p></div>
      <div class="admin-actions">
        <button class="secondary" @click="toggleDemo"><Icon :name="hasDemo ? 'trash-2' : 'database'" :size="15" /> {{ hasDemo ? 'Hapus data demo' : 'Isi data demo' }}</button>
        <button class="secondary" @click="emit('back')">← Kembali ke store</button>
      </div>
    </div>

    <div class="admin-tabs" role="tablist" aria-label="Menu admin">
      <button v-for="[id, label, icon] in tabs" :key="id" role="tab" :aria-selected="tab === id" :class="{ on: tab === id }" @click="tab = id"><Icon :name="icon" :size="15" /> {{ label }}</button>
    </div>

    <template v-if="tab === 'orders'">
      <div class="metrics">
        <article class="metric"><small>Total pesanan</small><strong>{{ orders.length }}</strong></article>
        <article class="metric"><small>Menunggu verifikasi</small><strong>{{ pending }}</strong></article>
        <article class="metric"><small>Terverifikasi</small><strong>{{ valid.length }}</strong></article>
        <article class="metric"><small>Total transaksi valid</small><strong>{{ rupiah(revenue) }}</strong></article>
      </div>
      <div class="panel">
        <div class="section-head admin-heading"><div><h3>Daftar pesanan</h3><p class="muted">Verifikasi atau tolak pesanan setelah memeriksa bukti.</p></div>
          <div class="admin-filters">
            <input v-model="q" class="field" placeholder="Cari ID / nama / game" aria-label="Cari pesanan" />
            <select v-model="filter" class="field" aria-label="Filter status"><option value="all">Semua status</option><option value="pending">Menunggu</option><option value="paid">Terverifikasi</option><option value="done">Berhasil</option><option value="rejected">Ditolak</option></select>
          </div>
        </div>
        <div class="table-wrap">
          <table class="admin-table">
            <thead><tr><th>ID / Waktu</th><th>Pelanggan</th><th>Game &amp; akun</th><th>Nominal</th><th>Bukti</th><th>Status</th><th>Aksi</th></tr></thead>
            <tbody>
              <tr v-for="order in visibleOrders" :key="order.id">
                <td><b>{{ order.id }}</b><br><span class="muted">{{ order.createdAt }}</span></td>
                <td>{{ order.buyer }}<br><span class="muted">{{ order.contact }}</span></td>
                <td>{{ order.game }}<br><span class="muted">ID: {{ order.playerId }} {{ order.zoneId ? '· Zone: ' + order.zoneId : '' }}</span></td>
                <td>{{ order.nominal }}<br><b>{{ rupiah(orderTotal(order)) }}</b><span v-if="order.voucher" class="muted"> · {{ order.voucher }}</span></td>
                <td><button v-if="order.proof" class="action-btn" @click="emit('view-proof', order)">Lihat bukti</button><span v-else>—</span></td>
                <td><span class="status" :class="order.status">{{ statusLabel(order.status) }}</span></td>
                <td v-if="order.status === 'pending'"><button class="action-btn ok" @click="emit('update-status', order.id, 'paid')">Verifikasi</button><button class="action-btn no" @click="emit('update-status', order.id, 'rejected')">Tolak</button></td>
                <td v-else-if="order.status === 'paid'"><button class="action-btn ok" @click="emit('update-status', order.id, 'done')">Tandai berhasil</button></td>
                <td v-else><span class="muted">Selesai</span></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-if="!visibleOrders.length" class="empty">Belum ada pesanan untuk filter ini.</div>
      </div>
    </template>

    <AdminGames v-else-if="tab === 'games'" />
    <AdminProducts v-else-if="tab === 'products'" />
    <AdminUsers v-else-if="tab === 'users'" />
    <AdminReports v-else-if="tab === 'reports'" :orders="orders" />
    <AdminVouchers v-else-if="tab === 'vouchers'" />
  </section>
</template>
