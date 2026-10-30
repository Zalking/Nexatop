<script setup>
import { computed, ref } from 'vue'
import { rupiah } from '../../data/games'
import { notify, orderTotal, state } from '../../lib/store'
const q = ref('')
const list = computed(() => state.users.filter((u) => `${u.name} ${u.email}`.toLowerCase().includes(q.value.toLowerCase())))
const stat = (u) => {
  const os = state.orders.filter((o) => o.userId === u.id)
  return { n: os.length, sum: os.filter((o) => o.status === 'paid' || o.status === 'done').reduce((s, o) => s + orderTotal(o), 0) }
}
function toggle(u) {
  if (state.session?.id === u.id) return notify('Kamu tidak bisa memblokir akun yang sedang dipakai.')
  u.status = u.status === 'blocked' ? 'active' : 'blocked'
  notify(u.status === 'blocked' ? `${u.name} diblokir.` : `${u.name} diaktifkan kembali.`)
}
</script>
<template>
  <div class="panel">
    <div class="section-head admin-heading"><div><h3>Pengguna</h3><p class="muted">{{ state.users.length }} akun terdaftar.</p></div>
      <input v-model="q" class="field" placeholder="Cari nama / email" aria-label="Cari pengguna" /></div>
    <div class="table-wrap">
      <table class="admin-table">
        <thead><tr><th>Pengguna</th><th>Kontak</th><th>Bergabung</th><th>Pesanan</th><th>Status</th><th>Aksi</th></tr></thead>
        <tbody>
          <tr v-for="u in list" :key="u.id">
            <td><b>{{ u.name }}</b><br><span class="muted">{{ u.email }}</span></td>
            <td>{{ u.phone || '—' }}</td>
            <td>{{ u.joinedAt }}</td>
            <td>{{ stat(u).n }}<br><span class="muted">{{ rupiah(stat(u).sum) }}</span></td>
            <td><span class="status" :class="u.status === 'active' ? 'paid' : 'rejected'">{{ u.status === 'active' ? 'Aktif' : 'Diblokir' }}</span></td>
            <td><button class="action-btn" :class="u.status === 'active' ? 'no' : 'ok'" @click="toggle(u)">{{ u.status === 'active' ? 'Blokir' : 'Aktifkan' }}</button></td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="!list.length" class="empty">Pengguna tidak ditemukan.</div>
  </div>
</template>
