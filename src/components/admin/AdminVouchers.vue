<script setup>
import { reactive } from 'vue'
import { rupiah } from '../../data/games'
import { notify, state } from '../../lib/store'
import Icon from '../Icon.vue'
const f = reactive({ code: '', title: '', type: 'percent', value: 10, max: 20000, min: 20000, expires: '2026-12-31' })
function add() {
  const code = f.code.trim().toUpperCase()
  if (!/^[A-Z0-9]{3,16}$/.test(code)) return notify('Kode 3–16 karakter huruf/angka tanpa spasi.')
  if (state.vouchers.some((v) => v.code === code)) return notify('Kode voucher sudah ada.')
  if (!(Number(f.value) > 0) || (f.type === 'percent' && Number(f.value) > 100)) return notify('Nilai diskon tidak valid.')
  state.vouchers.unshift({ code, title: f.title.trim() || 'Voucher ' + code, type: f.type, value: Number(f.value), max: Number(f.max) || 0, min: Number(f.min) || 0, games: [], active: true, expires: f.expires, note: 'Dibuat oleh admin' })
  notify(`Voucher ${code} dibuat.`)
  f.code = ''; f.title = ''
}
const remove = (code) => { state.vouchers = state.vouchers.filter((v) => v.code !== code); notify('Voucher dihapus.') }
</script>
<template>
  <div class="panel">
    <div class="section-head admin-heading"><div><h3>Voucher &amp; promo</h3><p class="muted">Buat, aktifkan, atau hapus kode voucher.</p></div></div>
    <div class="table-wrap">
      <table class="admin-table">
        <thead><tr><th>Kode</th><th>Diskon</th><th>Syarat</th><th>Berlaku s.d.</th><th>Status</th><th>Aksi</th></tr></thead>
        <tbody>
          <tr v-for="v in state.vouchers" :key="v.code">
            <td><b>{{ v.code }}</b><br><span class="muted">{{ v.title }}</span></td>
            <td>{{ v.type === 'percent' ? v.value + '%' : rupiah(v.value) }}<br><span class="muted">maks. {{ rupiah(v.max) }}</span></td>
            <td>Min. {{ rupiah(v.min) }}<br><span class="muted">{{ v.games?.length ? v.games.join(', ') : 'Semua game' }}</span></td>
            <td>{{ v.expires }}</td>
            <td><span class="status" :class="v.active ? 'paid' : 'rejected'">{{ v.active ? 'Aktif' : 'Nonaktif' }}</span></td>
            <td><button class="action-btn" @click="v.active = !v.active">{{ v.active ? 'Nonaktifkan' : 'Aktifkan' }}</button><button class="action-btn no" @click="remove(v.code)">Hapus</button></td>
          </tr>
        </tbody>
      </table>
    </div>
    <h3 class="mt">Buat voucher</h3>
    <div class="form-grid three mt">
      <div class="form-field"><label for="vc">Kode</label><input id="vc" v-model="f.code" class="field" placeholder="MERDEKA17" /></div>
      <div class="form-field"><label for="vt">Judul</label><input id="vt" v-model="f.title" class="field" placeholder="Diskon spesial" /></div>
      <div class="form-field"><label for="vy">Tipe</label><select id="vy" v-model="f.type" class="field"><option value="percent">Persen (%)</option><option value="flat">Potongan tetap (Rp)</option></select></div>
      <div class="form-field"><label for="vv">Nilai</label><input id="vv" v-model="f.value" class="field" type="number" min="1" /></div>
      <div class="form-field"><label for="vm">Maks. potongan (Rp)</label><input id="vm" v-model="f.max" class="field" type="number" min="0" /></div>
      <div class="form-field"><label for="vn">Min. belanja (Rp)</label><input id="vn" v-model="f.min" class="field" type="number" min="0" /></div>
      <div class="form-field"><label for="vx">Berlaku s.d.</label><input id="vx" v-model="f.expires" class="field" type="date" /></div>
    </div>
    <button class="primary mt" @click="add"><Icon name="plus" :size="15" /> Buat voucher</button>
  </div>
</template>
