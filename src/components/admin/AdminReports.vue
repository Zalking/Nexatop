<script setup>
import { computed, ref } from 'vue'
import { rupiah } from '../../data/games'
import { orderTotal } from '../../lib/store'
const props = defineProps({ orders: { type: Array, required: true } })
const range = ref(7)
const DAY = 86400000
const valid = (o) => o.status === 'paid' || o.status === 'done'
const inRange = computed(() => {
  const from = Date.now() - range.value * DAY
  return props.orders.filter((o) => (o.ts ?? Date.now()) >= from)
})
const days = computed(() => {
  const arr = []
  const start = new Date(); start.setHours(0, 0, 0, 0)
  for (let i = range.value - 1; i >= 0; i--) {
    const d = new Date(start.getTime() - i * DAY)
    const next = d.getTime() + DAY
    const total = inRange.value.filter((o) => valid(o) && (o.ts ?? Date.now()) >= d.getTime() && (o.ts ?? Date.now()) < next).reduce((s, o) => s + orderTotal(o), 0)
    arr.push({ label: d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }), total })
  }
  return arr
})
const max = computed(() => Math.max(1, ...days.value.map((d) => d.total)))
const revenue = computed(() => inRange.value.filter(valid).reduce((s, o) => s + orderTotal(o), 0))
const success = computed(() => inRange.value.length ? Math.round((inRange.value.filter(valid).length / inRange.value.length) * 100) : 0)
const top = computed(() => {
  const m = {}
  inRange.value.filter(valid).forEach((o) => { m[o.game] = m[o.game] || { n: 0, sum: 0 }; m[o.game].n++; m[o.game].sum += orderTotal(o) })
  return Object.entries(m).map(([name, v]) => ({ name, ...v })).sort((a, b) => b.sum - a.sum).slice(0, 5)
})
const topMax = computed(() => Math.max(1, ...top.value.map((t) => t.sum)))
const W = 640, H = 200, P = 28
const bw = computed(() => (W - P * 2) / days.value.length)
</script>
<template>
  <div>
    <div class="section-head admin-heading"><div><h3>Laporan penjualan</h3><p class="muted">Dihitung dari pesanan terverifikasi dan berhasil.</p></div>
      <select v-model.number="range" class="field" aria-label="Rentang waktu"><option :value="7">7 hari terakhir</option><option :value="14">14 hari terakhir</option><option :value="30">30 hari terakhir</option></select></div>
    <div class="metrics">
      <article class="metric"><small>Pendapatan valid</small><strong>{{ rupiah(revenue) }}</strong></article>
      <article class="metric"><small>Pesanan</small><strong>{{ inRange.length }}</strong></article>
      <article class="metric"><small>Tingkat berhasil</small><strong>{{ success }}%</strong></article>
      <article class="metric"><small>Rata-rata / pesanan</small><strong>{{ rupiah(inRange.filter(valid).length ? Math.round(revenue / inRange.filter(valid).length) : 0) }}</strong></article>
    </div>
    <div class="report-grid">
      <div class="panel">
        <h3>Pendapatan harian</h3>
        <svg class="chart" :viewBox="`0 0 ${W} ${H + 26}`" role="img" :aria-label="`Grafik pendapatan ${range} hari terakhir`">
          <line v-for="t in 4" :key="t" :x1="P" :x2="W - P" :y1="(H / 4) * (t - 1) + 8" :y2="(H / 4) * (t - 1) + 8" class="gridline" />
          <g v-for="(d, i) in days" :key="i">
            <rect :x="P + i * bw + bw * 0.18" :y="8 + (H - 8) * (1 - d.total / max)" :width="bw * 0.64" :height="Math.max(2, (H - 8) * (d.total / max))" rx="4" class="bar"><title>{{ d.label }}: {{ rupiah(d.total) }}</title></rect>
            <text v-if="range <= 14 || i % 3 === 0" :x="P + i * bw + bw / 2" :y="H + 20" class="axis" text-anchor="middle">{{ d.label }}</text>
          </g>
        </svg>
        <p v-if="!revenue" class="muted small">Belum ada transaksi valid. Gunakan “Isi data demo” untuk melihat contoh grafik.</p>
      </div>
      <div class="panel">
        <h3>Game terlaris</h3>
        <ul class="toplist">
          <li v-for="t in top" :key="t.name"><span><b>{{ t.name }}</b><small class="muted">{{ t.n }} pesanan · {{ rupiah(t.sum) }}</small></span><i><u :style="{ width: (t.sum / topMax) * 100 + '%' }"></u></i></li>
        </ul>
        <p v-if="!top.length" class="muted small">Belum ada data.</p>
      </div>
    </div>
  </div>
</template>
