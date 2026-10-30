<script setup>
import { computed } from 'vue'
import { rupiah } from '../data/games'
import { notify, state } from '../lib/store'
import { go, href } from '../lib/router'
import illController from '../assets/ill-controller.svg'
import illDiamond from '../assets/ill-diamond.svg'
import Icon from '../components/Icon.vue'

const expired = (v) => v.expires && new Date(v.expires + 'T23:59:59') < new Date()
const available = computed(() => state.vouchers.filter((v) => v.active && !expired(v)))
const ended = computed(() => state.vouchers.filter((v) => !v.active || expired(v)))
function use(v) {
  state.draft.voucher = v.code
  navigator.clipboard?.writeText(v.code).catch(() => {})
  notify(`Kode ${v.code} disalin dan siap dipakai di checkout.`)
  go(state.draft.gameId && state.draft.nominalLabel ? 'checkout' : 'games')
}
const label = (v) => (v.type === 'percent' ? `${v.value}%` : rupiah(v.value))
</script>

<template>
  <section class="page">
    <div class="page-head">
      <div><div class="eyebrow">VOUCHER &amp; PROMO</div><h1>Hemat lebih banyak</h1><p class="muted">Pilih voucher, salin kodenya, lalu pakai di checkout.</p></div>
    </div>
    <div class="promo-row">
      <article class="promo-banner"><img :src="illController" alt="" /><div><em>PENGGUNA BARU</em><h3>Diskon 20% pesanan pertama</h3><p>Kode <b>NEWUSER</b></p></div></article>
      <article class="promo-banner alt"><img :src="illDiamond" alt="" /><div><em>FLASH PROMO</em><h3>Mobile Legends hemat 15%</h3><p>Kode <b>ML15</b></p></div></article>
    </div>

    <h2 class="sub-h">Voucher tersedia</h2>
    <div class="voucher-grid">
      <article v-for="v in available" :key="v.code" class="voucher">
        <div class="voucher-val"><b>{{ label(v) }}</b><small>{{ v.type === 'percent' ? 'DISKON' : 'POTONGAN' }}</small></div>
        <div class="voucher-body">
          <b>{{ v.title }}</b>
          <small class="muted">{{ v.note }} · s.d. {{ v.expires }}</small>
          <code>{{ v.code }}</code>
        </div>
        <button class="primary sm" @click="use(v)">Pakai</button>
      </article>
    </div>
    <div v-if="!available.length" class="empty">Belum ada voucher aktif.</div>

    <template v-if="ended.length">
      <h2 class="sub-h">Tidak aktif / berakhir</h2>
      <div class="voucher-grid">
        <article v-for="v in ended" :key="v.code" class="voucher off">
          <div class="voucher-val"><b>{{ label(v) }}</b><small>BERAKHIR</small></div>
          <div class="voucher-body"><b>{{ v.title }}</b><small class="muted">{{ v.note }}</small><code>{{ v.code }}</code></div>
        </article>
      </div>
    </template>
    <p class="notice">Syarat: voucher tidak dapat digabung. Diskon dihitung otomatis di checkout. <a :href="href('help')">Lihat FAQ voucher</a></p>
  </section>
</template>
