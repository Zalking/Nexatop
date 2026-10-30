<script setup>
import { computed, watchEffect } from 'vue'
import { platformLabels, rupiah } from '../data/games'
import { draftNominal, draftPricing, gameById, games, notify, startDraft, state } from '../lib/store'
import { go, href, route } from '../lib/router'
import Icon from '../components/Icon.vue'

const game = computed(() => gameById(route.value.segments[1]))
watchEffect(() => {
  if (game.value && game.value.active) startDraft(game.value.id)
})
const related = computed(() => games.value.filter((g) => g.id !== game.value?.id).slice(0, 4))
const minPrice = computed(() => (game.value ? Math.min(...game.value.nominals.map((n) => n.price)) : 0))

function next() {
  const d = state.draft
  if (!draftNominal.value) return notify('Pilih nominal terlebih dahulu.')
  if (!d.playerId.trim()) return notify('Masukkan User ID / Player ID.')
  if (game.value.needsZone && !d.zoneId.trim()) return notify('Game ini memerlukan Zone / Server ID.')
  go('checkout')
}
</script>

<template>
  <section v-if="game && game.active" class="page">
    <nav class="crumbs" aria-label="Breadcrumb">
      <a :href="href('')">Beranda</a><Icon name="chevron-right" :size="12" /><a :href="href('games')">Game</a><Icon name="chevron-right" :size="12" /><span>{{ game.name }}</span>
    </nav>

    <div class="detail-hero" :style="{ '--cover': `url(${game.image})` }">
      <img :src="game.image" :alt="`Artwork ${game.name}`" />
      <div class="detail-hero-info">
        <span v-if="game.tag" class="game-tag static">{{ game.tag }}</span>
        <h1>{{ game.name }}</h1>
        <p class="muted">{{ game.desc }}</p>
        <div class="meta-row">
          <span><Icon name="star" :size="14" /> {{ game.rating }}</span>
          <span><Icon name="shopping-bag" :size="14" /> {{ game.sold }} terjual</span>
          <span v-for="p in game.platforms" :key="p"><Icon :name="p === 'pc' ? 'monitor' : p === 'console' ? 'tv' : 'smartphone'" :size="14" /> {{ platformLabels[p] }}</span>
          <span><Icon name="zap" :size="14" /> Mulai {{ rupiah(minPrice) }}</span>
        </div>
      </div>
    </div>

    <div class="content-grid">
      <div class="panel">
        <div class="step"><span>1</span> PILIH NOMINAL</div>
        <div class="nominals">
          <button v-for="n in game.nominals" :key="n.label" class="nominal" :class="{ active: state.draft.nominalLabel === n.label }" @click="state.draft.nominalLabel = n.label">
            <strong>{{ n.label }}</strong><small>{{ rupiah(n.price) }}</small>
          </button>
        </div>

        <div class="step"><span>2</span> DATA AKUN GAME</div>
        <div class="form-grid">
          <div class="form-field">
            <label for="playerId">User ID / Player ID *</label>
            <input id="playerId" v-model="state.draft.playerId" class="field" placeholder="Masukkan User ID" inputmode="numeric" autocomplete="off" />
          </div>
          <div class="form-field">
            <label for="zoneId">Zone / Server ID <span v-if="game.needsZone">*</span></label>
            <input id="zoneId" v-model="state.draft.zoneId" class="field" :placeholder="game.needsZone ? 'Masukkan Zone / Server ID' : 'Opsional jika diperlukan'" autocomplete="off" />
          </div>
        </div>
        <p class="notice"><Icon name="info" :size="13" /> Pastikan ID sudah benar. Top up yang salah ID tidak dapat dikembalikan.</p>
      </div>

      <aside class="panel summary-panel">
        <div class="summary-title">
          <div><h3>Ringkasan pesanan</h3><p class="muted">Pastikan detail sudah sesuai.</p></div>
          <span>01</span>
        </div>
        <div class="summary-line"><span>Game</span><strong>{{ game.name }}</strong></div>
        <div class="summary-line"><span>Nominal</span><strong>{{ draftNominal?.label || '—' }}</strong></div>
        <div class="summary-line"><span>Harga</span><strong>{{ rupiah(draftPricing.subtotal) }}</strong></div>
        <div class="summary-line total"><span>Subtotal</span><strong>{{ rupiah(draftPricing.subtotal) }}</strong></div>
        <button class="primary submit center" @click="next">Lanjut ke Checkout <Icon name="arrow-right" :size="16" /></button>
        <p class="notice">Voucher dan metode pembayaran dipilih pada langkah berikutnya.</p>
      </aside>
    </div>

    <div class="section-head"><div><div class="eyebrow">JELAJAHI</div><h2>Game lainnya</h2></div></div>
    <div class="game-grid">
      <a v-for="g in related" :key="g.id" class="game-card as-link" :href="href('game/' + g.id)">
        <div class="game-media"><img class="game-cover" :src="g.image" :alt="`Artwork ${g.name}`" loading="lazy" /></div>
        <strong>{{ g.name }}</strong><small>{{ g.category }}</small>
      </a>
    </div>
  </section>

  <section v-else class="page empty-page">
    <Icon name="alert-circle" :size="40" />
    <h1>Game tidak ditemukan</h1>
    <p class="muted">Game yang kamu cari tidak tersedia atau sedang dinonaktifkan.</p>
    <a class="primary link-btn" :href="href('games')">Lihat semua game</a>
  </section>
</template>
