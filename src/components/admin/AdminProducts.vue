<script setup>
import { computed, ref } from 'vue'
import { rupiah } from '../../data/games'
import { allGames, gameById, notify, saveGameEdit } from '../../lib/store'
import Icon from '../Icon.vue'
const gid = ref('ml')
const game = computed(() => gameById(gid.value) || allGames.value[0])
const nl = ref('')
const np = ref('')
const save = (nominals) => saveGameEdit(game.value.id, { nominals })
function setPrice(i, v) {
  const n = Number(v)
  if (!Number.isFinite(n) || n <= 0) return notify('Harga harus berupa angka lebih dari 0.')
  save(game.value.nominals.map((x, j) => (j === i ? { ...x, price: Math.round(n) } : x)))
  notify('Harga diperbarui.')
}
function remove(i) {
  if (game.value.nominals.length <= 1) return notify('Minimal harus ada satu paket.')
  save(game.value.nominals.filter((_, j) => j !== i))
  notify('Paket dihapus.')
}
function add() {
  const price = Number(np.value)
  if (!nl.value.trim() || !(price > 0)) return notify('Isi nama paket dan harga yang valid.')
  if (game.value.nominals.some((x) => x.label.toLowerCase() === nl.value.trim().toLowerCase())) return notify('Nama paket sudah ada.')
  save([...game.value.nominals, { label: nl.value.trim(), price: Math.round(price) }])
  nl.value = ''; np.value = ''
  notify('Paket ditambahkan.')
}
</script>
<template>
  <div class="panel">
    <div class="section-head admin-heading"><div><h3>Produk &amp; harga</h3><p class="muted">Atur paket nominal tiap game. Perubahan langsung tampil di halaman toko.</p></div>
      <select v-model="gid" class="field" aria-label="Pilih game"><option v-for="g in allGames" :key="g.id" :value="g.id">{{ g.name }}</option></select>
    </div>
    <div class="table-wrap">
      <table class="admin-table">
        <thead><tr><th>Paket</th><th>Harga (Rp)</th><th>Tampil</th><th>Aksi</th></tr></thead>
        <tbody>
          <tr v-for="(n, i) in game.nominals" :key="n.label">
            <td><b>{{ n.label }}</b></td>
            <td><input class="field slim" type="number" min="1" :value="n.price" :aria-label="`Harga ${n.label}`" @change="setPrice(i, $event.target.value)" /></td>
            <td>{{ rupiah(n.price) }}</td>
            <td><button class="action-btn no" @click="remove(i)">Hapus</button></td>
          </tr>
        </tbody>
      </table>
    </div>
    <h3 class="mt">Tambah paket</h3>
    <div class="inline-form mt">
      <input v-model="nl" class="field" placeholder="mis. 1000 Diamonds" aria-label="Nama paket" />
      <input v-model="np" class="field" type="number" min="1" placeholder="Harga" aria-label="Harga paket" />
      <button class="primary" @click="add"><Icon name="plus" :size="15" /> Tambah</button>
    </div>
  </div>
</template>
