<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import heroImage from '../assets/hero-gaming.svg'
import bgNeon from '../assets/bg-neon.svg'
import illController from '../assets/ill-controller.svg'
import illDiamond from '../assets/ill-diamond.svg'
import { rupiah } from '../data/games'
import { games, notify } from '../lib/store'
import { go, href } from '../lib/router'
import GameCard from '../components/GameCard.vue'
import Icon from '../components/Icon.vue'

const search = ref('')
const slide = ref(0)
const popular = computed(() => games.value.filter((g) => g.popular))
const slides = computed(() => (popular.value.length ? popular.value : games.value).slice(0, 5))
const filteredGames = computed(() =>
  games.value.filter((g) => `${g.name} ${g.category}`.toLowerCase().includes(search.value.toLowerCase())).slice(0, 8),
)
const recommended = computed(() =>
  games.value
    .filter((g) => g.nominals?.length)
    .slice(0, 8)
    .map((g) => ({ game: g, nominal: g.nominals[Math.min(2, g.nominals.length - 1)] })),
)
const platforms = [
  { id: 'pc', label: 'PC', icon: 'monitor' },
  { id: 'mobile', label: 'Mobile', icon: 'smartphone' },
  { id: 'console', label: 'Console', icon: 'tv' },
  { id: 'voucher', label: 'Voucher', icon: 'gift' },
]
const steps = [
  { icon: 'grid', t: 'Pilih game & nominal', d: 'Temukan game favoritmu lalu pilih paket yang sesuai.' },
  { icon: 'user', t: 'Isi data akun', d: 'Masukkan User ID dan Zone ID dengan benar.' },
  { icon: 'credit-card', t: 'Bayar & unggah bukti', d: 'Transfer sesuai total lalu unggah bukti pembayaran.' },
  { icon: 'zap', t: 'Admin memproses', d: 'Setelah diverifikasi, item dikirim ke akunmu.' },
]
let timer
onMounted(() => (timer = setInterval(() => (slide.value = (slide.value + 1) % Math.max(slides.value.length, 1)), 5000)))
onBeforeUnmount(() => clearInterval(timer))

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}
function copy(code) {
  navigator.clipboard?.writeText(code).catch(() => {})
  notify(`Kode ${code} disalin. Tempel di halaman checkout.`)
}
</script>

<template>
  <div>
    <section class="hero hero-bg" :style="{ '--hero-bg': `url(${bgNeon})` }">
      <div class="hero-copy">
        <div class="eyebrow"><Icon name="zap" :size="13" /> TOP UP CEPAT, MAIN MAKIN DEKAT</div>
        <h1>Level up your game.<br /><span>Top up tanpa ribet.</span></h1>
        <p>
          Isi kebutuhan game favoritmu dengan alur yang simpel. Transfer manual, unggah bukti
          pembayaran, lalu admin akan memverifikasi pesananmu.
        </p>
        <div class="hero-actions">
          <button class="primary" @click="scrollTo('games')">Pilih Game <Icon name="arrow-up-right" :size="16" /></button>
          <button class="secondary" @click="scrollTo('order')">Cara pesan</button>
        </div>
        <div class="trust-row">
          <span><Icon name="check" :size="14" /> Alur simpel</span>
          <span><Icon name="check" :size="14" /> Verifikasi manual</span>
          <span><Icon name="eye" :size="14" /> Ringkasan transparan</span>
        </div>
      </div>
      <div class="hero-art">
        <img class="hero-base" :src="heroImage" alt="" aria-hidden="true" />
        <a
          v-for="(g, i) in slides"
          :key="g.id"
          class="hero-slide"
          :class="{ on: i === slide }"
          :href="href('game/' + g.id)"
          :aria-hidden="i !== slide"
          :tabindex="i === slide ? 0 : -1"
        >
          <img :src="g.image" :alt="`Banner ${g.name}`" />
          <span class="hero-slide-info"><b>{{ g.name }}</b><small>{{ g.category }}</small></span>
        </a>
        <div class="hero-stat">
          <strong><Icon name="zap" :size="16" /> Fast &amp; simple</strong><small>Manual payment verification</small>
        </div>
        <div class="hero-dots" role="tablist" aria-label="Pilih banner">
          <button v-for="(g, i) in slides" :key="g.id" :class="{ on: i === slide }" :aria-label="`Banner ${g.name}`" @click="slide = i"></button>
        </div>
      </div>
    </section>

    <section class="platform-row" aria-label="Kategori platform">
      <a v-for="p in platforms" :key="p.id" class="platform-tile" :href="p.id === 'voucher' ? href('promo') : href('games?platform=' + p.id)">
        <span class="platform-ico"><Icon :name="p.icon" :size="26" /></span>
        <span><b>{{ p.label }}</b><em>{{ p.id === 'voucher' ? 'LIHAT PROMO' : 'LIHAT GAME' }}</em></span>
      </a>
    </section>

    <section id="games" class="games-section">
      <div class="section-head">
        <div>
          <div class="eyebrow">PILIH FAVORITMU</div>
          <h2>Game populer</h2>
          <p class="muted">Pilih game untuk melihat pilihan nominal.</p>
        </div>
        <input v-model="search" class="field search" placeholder="Cari game..." aria-label="Cari game" />
      </div>
      <div class="game-grid">
        <GameCard v-for="game in filteredGames" :key="game.id" :game="game" @select="(g) => go('game/' + g.id)" />
      </div>
      <div v-if="!filteredGames.length" class="empty">Game tidak ditemukan. Coba kata kunci lain.</div>
      <div class="all-games"><span></span><a class="all-btn" :href="href('games')">SEMUA GAME</a><span></span></div>
    </section>

    <section class="promo-row" aria-label="Promo">
      <article class="promo-banner">
        <img :src="illController" alt="" />
        <div>
          <em>PROMO PENGGUNA BARU</em>
          <h3>Diskon 20% pesanan pertama</h3>
          <p>Gunakan kode <b>NEWUSER</b> saat checkout. Maks. potongan Rp30.000.</p>
          <button class="primary sm" @click="copy('NEWUSER')"><Icon name="copy" :size="14" /> Salin kode</button>
        </div>
      </article>
      <article class="promo-banner alt">
        <img :src="illDiamond" alt="" />
        <div>
          <em>FLASH PROMO DIAMONDS</em>
          <h3>Mobile Legends hemat 15%</h3>
          <p>Gunakan kode <b>ML15</b>. Berlaku untuk semua paket Diamonds.</p>
          <button class="primary sm" @click="copy('ML15')"><Icon name="copy" :size="14" /> Salin kode</button>
        </div>
      </article>
    </section>

    <section class="reco-section">
      <div class="section-head">
        <div>
          <div class="eyebrow">REKOMENDASI</div>
          <h2>Paket pilihan untukmu</h2>
          <p class="muted">Paket yang paling sering dibeli pemain.</p>
        </div>
        <a class="secondary link-btn" :href="href('promo')">Lihat semua promo</a>
      </div>
      <div class="reco-grid">
        <a v-for="r in recommended" :key="r.game.id" class="reco-card" :href="href('game/' + r.game.id)">
          <img :src="r.game.image" :alt="`Artwork ${r.game.name}`" loading="lazy" />
          <span>
            <b>{{ r.game.name }}</b>
            <small>{{ r.nominal.label }}</small>
            <strong>{{ rupiah(r.nominal.price) }}</strong>
          </span>
          <Icon name="chevron-right" :size="18" />
        </a>
      </div>
    </section>

    <section id="order" class="how-section">
      <div class="section-head">
        <div>
          <div class="eyebrow">PROSES PESANAN</div>
          <h2>Cara top up</h2>
          <p class="muted">Empat langkah mudah, tanpa perlu akun.</p>
        </div>
        <button class="primary" @click="go('games')">Mulai top up <Icon name="arrow-up-right" :size="16" /></button>
      </div>
      <div class="steps-grid">
        <div v-for="(s, i) in steps" :key="s.t" class="how-card">
          <span class="how-num">{{ i + 1 }}</span>
          <Icon :name="s.icon" :size="24" />
          <b>{{ s.t }}</b>
          <p class="muted">{{ s.d }}</p>
        </div>
      </div>
    </section>
  </div>
</template>
