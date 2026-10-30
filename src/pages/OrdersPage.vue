<script setup>
import { computed, ref } from 'vue'
import { rupiah, statusLabel } from '../data/games'
import { myOrders, orderTotal, state } from '../lib/store'
import { href } from '../lib/router'
import Icon from '../components/Icon.vue'

const filter = ref('all')
const q = ref('')
const list = computed(() =>
  myOrders.value.filter((o) => (filter.value === 'all' || o.status === filter.value) && `${o.id} ${o.game} ${o.nominal}`.toLowerCase().includes(q.value.toLowerCase())),
)
const tabs = [['all', 'Semua'], ['pending', 'Menunggu'], ['paid', 'Terverifikasi'], ['done', 'Berhasil'], ['rejected', 'Ditolak']]
const count = (s) => myOrders.value.filter((o) => s === 'all' || o.status === s).length
</script>

<template>
  <section class="page">
    <div class="page-head">
      <div><div class="eyebrow">RIWAYAT</div><h1>Pesanan saya</h1>
        <p class="muted">{{ state.session ? 'Pesanan atas nama ' + state.session.name : 'Pesanan yang dibuat di browser ini.' }}</p></div>
      <input v-model="q" class="field search" placeholder="Cari ID pesanan / game..." aria-label="Cari pesanan" />
    </div>
    <div class="chips" role="group" aria-label="Filter status">
      <button v-for="[id, label] in tabs" :key="id" class="chip" :class="{ on: filter === id }" @click="filter = id">{{ label }} <i>{{ count(id) }}</i></button>
    </div>

    <div class="order-list">
      <a v-for="o in list" :key="o.id" class="order-card" :href="href('order/' + o.id)">
        <span class="order-ico"><Icon name="package" :size="20" /></span>
        <span class="order-main">
          <b>{{ o.game }} · {{ o.nominal }}</b>
          <small class="muted">{{ o.id }} · {{ o.createdAt }}</small>
        </span>
        <span class="order-side"><strong>{{ rupiah(orderTotal(o)) }}</strong><span class="status" :class="o.status">{{ statusLabel(o.status) }}</span></span>
        <Icon name="chevron-right" :size="18" />
      </a>
    </div>
    <div v-if="!list.length" class="empty">
      <Icon name="inbox" :size="32" />
      <p>Belum ada pesanan{{ filter !== 'all' ? ' untuk status ini' : '' }}.</p>
      <a class="primary link-btn" :href="href('games')">Mulai top up</a>
    </div>
  </section>
</template>
