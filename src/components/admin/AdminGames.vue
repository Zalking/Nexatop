<script setup>
import { reactive } from 'vue'
import { addCustomGame, allGames, notify, saveGameEdit } from '../../lib/store'
import Icon from '../Icon.vue'
const f = reactive({ name: '', currency: '', category: '', needsZone: false })
function add() {
  if (!f.name.trim() || !f.currency.trim()) return notify('Isi nama game dan mata uang (mis. Diamonds).')
  addCustomGame({ name: f.name.trim(), currency: f.currency.trim(), category: f.category.trim(), needsZone: f.needsZone })
  notify(`Game ${f.name} ditambahkan. Atur nominal di tab Produk.`)
  Object.assign(f, { name: '', currency: '', category: '', needsZone: false })
}
</script>
<template>
  <div class="panel">
    <div class="section-head admin-heading"><div><h3>Kelola game</h3><p class="muted">Ubah nama, aktifkan atau nonaktifkan game di katalog.</p></div></div>
    <div class="table-wrap">
      <table class="admin-table">
        <thead><tr><th>Game</th><th>Kategori</th><th>Paket</th><th>Status</th><th>Aksi</th></tr></thead>
        <tbody>
          <tr v-for="g in allGames" :key="g.id">
            <td class="game-cell"><img :src="g.image" alt="" /><input class="field slim" :value="g.name" :aria-label="`Nama ${g.name}`" @change="saveGameEdit(g.id, { name: $event.target.value.trim() || g.name })" /></td>
            <td>{{ g.category }}</td>
            <td>{{ g.nominals.length }} paket</td>
            <td><span class="status" :class="g.active ? 'paid' : 'rejected'">{{ g.active ? 'Aktif' : 'Nonaktif' }}</span></td>
            <td><button class="action-btn" @click="saveGameEdit(g.id, { active: !g.active }); notify(g.active ? 'Game dinonaktifkan.' : 'Game diaktifkan.')">{{ g.active ? 'Nonaktifkan' : 'Aktifkan' }}</button></td>
          </tr>
        </tbody>
      </table>
    </div>
    <h3 class="mt">Tambah game baru</h3>
    <div class="form-grid mt">
      <div class="form-field"><label for="gn">Nama game *</label><input id="gn" v-model="f.name" class="field" placeholder="mis. Arena of Valor" /></div>
      <div class="form-field"><label for="gc">Mata uang *</label><input id="gc" v-model="f.currency" class="field" placeholder="mis. Vouchers" /></div>
      <div class="form-field"><label for="gk">Kategori</label><input id="gk" v-model="f.category" class="field" placeholder="mis. MOBA · Vouchers" /></div>
      <label class="check-row"><input v-model="f.needsZone" type="checkbox" /> Memerlukan Zone / Server ID</label>
    </div>
    <button class="primary mt" @click="add"><Icon name="plus" :size="15" /> Tambah game</button>
  </div>
</template>
