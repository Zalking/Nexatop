<script setup>
import { computed, ref, watch } from 'vue'
import { genreOf, platformLabels } from '../data/games'
import { games } from '../lib/store'
import { go, route } from '../lib/router'
import GameCard from '../components/GameCard.vue'

const search = ref('')
const genre = ref('all')
const platform = ref(route.value.query.platform || 'all')
const sort = ref('popular')
watch(() => route.value.query.platform, (v) => (platform.value = v || 'all'))

const genres = computed(() => ['all', ...new Set(games.value.map(genreOf))])
const list = computed(() => {
  let l = games.value.filter(
    (g) =>
      `${g.name} ${g.category}`.toLowerCase().includes(search.value.toLowerCase()) &&
      (genre.value === 'all' || genreOf(g) === genre.value) &&
      (platform.value === 'all' || g.platforms?.includes(platform.value)),
  )
  if (sort.value === 'name') l = [...l].sort((a, b) => a.name.localeCompare(b.name))
  if (sort.value === 'cheap') l = [...l].sort((a, b) => Math.min(...a.nominals.map((n) => n.price)) - Math.min(...b.nominals.map((n) => n.price)))
  if (sort.value === 'popular') l = [...l].sort((a, b) => Number(!!b.popular) - Number(!!a.popular) || (b.rating || 0) - (a.rating || 0))
  return l
})
</script>

<template>
  <section class="page">
    <div class="page-head">
      <div>
        <div class="eyebrow">KATALOG</div>
        <h1>Semua game</h1>
        <p class="muted">Temukan game dan paket top up yang kamu butuhkan.</p>
      </div>
      <input v-model="search" class="field search" placeholder="Cari game..." aria-label="Cari game" />
    </div>

    <div class="filter-bar">
      <div class="chips" role="group" aria-label="Filter genre">
        <button v-for="g in genres" :key="g" class="chip" :class="{ on: genre === g }" @click="genre = g">{{ g === 'all' ? 'Semua genre' : g }}</button>
      </div>
      <div class="filter-right">
        <select v-model="platform" class="field" aria-label="Platform">
          <option value="all">Semua platform</option>
          <option v-for="(label, id) in platformLabels" :key="id" :value="id">{{ label }}</option>
        </select>
        <select v-model="sort" class="field" aria-label="Urutkan">
          <option value="popular">Terpopuler</option>
          <option value="cheap">Harga terendah</option>
          <option value="name">Nama A–Z</option>
        </select>
      </div>
    </div>

    <div class="game-grid">
      <GameCard v-for="g in list" :key="g.id" :game="g" @select="(x) => go('game/' + x.id)" />
    </div>
    <div v-if="!list.length" class="empty">Tidak ada game yang cocok dengan filter ini.</div>
  </section>
</template>
