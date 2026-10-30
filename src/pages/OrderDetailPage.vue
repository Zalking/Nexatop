<script setup>
import { computed } from 'vue'
import { rupiah, statusLabel } from '../data/games'
import { notify, orderTotal, setOrderStatus, state } from '../lib/store'
import { href, route } from '../lib/router'
import Icon from '../components/Icon.vue'

const order = computed(() => state.orders.find((o) => o.id === route.value.segments[1]))
const steps = [['pending', 'Menunggu verifikasi', 'clock'], ['paid', 'Terverifikasi', 'shield'], ['done', 'Berhasil', 'check-circle']]
const stage = computed(() => {
  const s = order.value?.status
  return s === 'done' ? 2 : s === 'paid' ? 1 : 0
})
const timeline = computed(() => order.value?.timeline?.length ? order.value.timeline : [{ label: 'Pesanan dibuat', at: order.value?.createdAt }])

function cancel() {
  if (setOrderStatus(order.value.id, 'rejected', 'Pesanan dibatalkan oleh pelanggan')) notify('Pesanan dibatalkan.')
}
function copyId() {
  navigator.clipboard?.writeText(order.value.id).catch(() => {})
  notify('ID pesanan disalin.')
}
function viewProof() {
  const win = window.open()
  if (!win) return notify('Popup diblokir browser. Izinkan popup untuk melihat bukti.')
  const img = win.document.createElement('img')
  img.src = order.value.proof
  img.alt = `Bukti pembayaran ${order.value.id}`
  img.style.cssText = 'max-width:100%;height:auto'
  win.document.title = `Bukti ${order.value.id}`
  win.document.body.appendChild(img)
}
</script>

<template>
  <section v-if="order" class="page">
    <nav class="crumbs"><a :href="href('orders')">Pesanan saya</a><Icon name="chevron-right" :size="12" /><span>{{ order.id }}</span></nav>
    <div class="page-head">
      <div>
        <div class="eyebrow">DETAIL TRANSAKSI</div>
        <h1>{{ order.id }} <button class="icon-btn" aria-label="Salin ID" @click="copyId"><Icon name="copy" :size="16" /></button></h1>
        <p class="muted">Dibuat {{ order.createdAt }}</p>
      </div>
      <span class="status big" :class="order.status">{{ statusLabel(order.status) }}</span>
    </div>

    <div v-if="order.status !== 'rejected'" class="tracker" aria-label="Progres pesanan">
      <div v-for="(s, i) in steps" :key="s[0]" class="track-step" :class="{ done: i <= stage, now: i === stage }">
        <span class="track-dot"><Icon :name="s[2]" :size="18" /></span><b>{{ s[1] }}</b>
      </div>
    </div>
    <div v-else class="alert-box"><Icon name="x-circle" :size="18" /> Pesanan ditolak atau dibatalkan. Buat pesanan baru dengan bukti yang benar atau hubungi bantuan.</div>

    <div class="content-grid">
      <div class="panel">
        <h3>Rincian pesanan</h3>
        <dl class="kv">
          <div><dt>Game</dt><dd>{{ order.game }}</dd></div>
          <div><dt>Nominal</dt><dd>{{ order.nominal }}</dd></div>
          <div><dt>User ID</dt><dd>{{ order.playerId }}<span v-if="order.zoneId"> ({{ order.zoneId }})</span></dd></div>
          <div><dt>Pemesan</dt><dd>{{ order.buyer }}</dd></div>
          <div><dt>Kontak</dt><dd>{{ order.contact }}</dd></div>
          <div v-if="order.method"><dt>Metode</dt><dd>{{ order.method }}</dd></div>
        </dl>
        <h3 class="mt">Riwayat status</h3>
        <ol class="timeline">
          <li v-for="(t, i) in timeline" :key="i"><span></span><div><b>{{ t.label || statusLabel(t.status) }}</b><small class="muted">{{ t.at }}</small></div></li>
        </ol>
      </div>
      <aside class="panel summary-panel">
        <div class="summary-title"><div><h3>Ringkasan pembayaran</h3></div><span><Icon name="receipt" :size="16" /></span></div>
        <div class="summary-line"><span>Harga</span><strong>{{ rupiah(order.price) }}</strong></div>
        <div class="summary-line" v-if="order.discount"><span>Voucher {{ order.voucher }}</span><strong class="green">−{{ rupiah(order.discount) }}</strong></div>
        <div class="summary-line"><span>Biaya layanan</span><strong>{{ rupiah(order.fee || 0) }}</strong></div>
        <div class="summary-line total"><span>Total bayar</span><strong>{{ rupiah(orderTotal(order)) }}</strong></div>
        <button v-if="order.proof" class="secondary submit center" @click="viewProof"><Icon name="image" :size="15" /> Lihat bukti transfer</button>
        <button v-if="order.status === 'pending'" class="danger submit center" @click="cancel"><Icon name="x" :size="15" /> Batalkan pesanan</button>
        <a class="secondary submit center link-btn" :href="href('help')"><Icon name="help-circle" :size="15" /> Butuh bantuan?</a>
      </aside>
    </div>
  </section>
  <section v-else class="page empty-page">
    <Icon name="search" :size="40" /><h1>Pesanan tidak ditemukan</h1>
    <p class="muted">ID pesanan tidak cocok dengan data di browser ini.</p>
    <a class="primary link-btn" :href="href('orders')">Ke riwayat pesanan</a>
  </section>
</template>
