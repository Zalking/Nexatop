<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { rupiah } from '../data/games'
import { logout, myOrders, notify, orderTotal, state, updateProfile } from '../lib/store'
import { go, href } from '../lib/router'
import Icon from '../components/Icon.vue'

const tab = ref('profil')
const user = computed(() => state.session)
const form = reactive({ name: '', email: '', phone: '' })
watch(user, (u) => u && Object.assign(form, { name: u.name, email: u.email, phone: u.phone }), { immediate: true })
const initials = computed(() => (user.value?.name || '?').split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase())
const spent = computed(() => myOrders.value.filter((o) => o.status === 'done' || o.status === 'paid').reduce((s, o) => s + orderTotal(o), 0))

function save() {
  if (!form.name.trim() || !/^\S+@\S+\.\S+$/.test(form.email)) return notify('Isi nama dan email yang valid.')
  updateProfile({ name: form.name.trim(), email: form.email.trim(), phone: form.phone.trim() })
  notify('Profil berhasil disimpan.')
}
function out() { logout(); notify('Kamu telah keluar.'); go('') }
</script>

<template>
  <section v-if="user" class="page">
    <div class="profile-head">
      <span class="avatar lg">{{ initials }}</span>
      <div><div class="eyebrow">AKUN SAYA</div><h1>{{ user.name }}</h1><p class="muted">{{ user.email }} · Bergabung {{ user.joinedAt }}</p></div>
      <button class="secondary" @click="out"><Icon name="log-out" :size="15" /> Keluar</button>
    </div>
    <div class="metrics">
      <article class="metric"><small>Total pesanan</small><strong>{{ myOrders.length }}</strong></article>
      <article class="metric"><small>Berhasil</small><strong>{{ myOrders.filter((o) => o.status === 'done').length }}</strong></article>
      <article class="metric"><small>Menunggu</small><strong>{{ myOrders.filter((o) => o.status === 'pending').length }}</strong></article>
      <article class="metric"><small>Total belanja</small><strong>{{ rupiah(spent) }}</strong></article>
    </div>
    <div class="chips" role="tablist">
      <button class="chip" :class="{ on: tab === 'profil' }" @click="tab = 'profil'">Profil</button>
      <button class="chip" :class="{ on: tab === 'pengaturan' }" @click="tab = 'pengaturan'">Pengaturan</button>
    </div>

    <div v-if="tab === 'profil'" class="panel narrow">
      <h3>Data profil</h3>
      <div class="form-grid mt">
        <div class="form-field wide"><label for="pn">Nama lengkap</label><input id="pn" v-model="form.name" class="field" /></div>
        <div class="form-field"><label for="pe">Email</label><input id="pe" v-model="form.email" class="field" type="email" /></div>
        <div class="form-field"><label for="pp">No. WhatsApp</label><input id="pp" v-model="form.phone" class="field" inputmode="tel" /></div>
      </div>
      <button class="primary mt" @click="save">Simpan perubahan</button>
    </div>

    <div v-else class="panel narrow">
      <h3>Notifikasi</h3>
      <label class="switch-row"><span><b>Notifikasi email</b><small class="muted">Kabar status pesanan lewat email.</small></span><input v-model="state.settings.notifEmail" type="checkbox" /></label>
      <label class="switch-row"><span><b>Notifikasi WhatsApp</b><small class="muted">Kabar status pesanan lewat WhatsApp.</small></span><input v-model="state.settings.notifWa" type="checkbox" /></label>
      <label class="switch-row"><span><b>Info promo</b><small class="muted">Terima voucher dan promo terbaru.</small></span><input v-model="state.settings.promo" type="checkbox" /></label>
      <h3 class="mt">Keamanan &amp; data</h3>
      <p class="muted">Prototype ini tidak memakai kata sandi. Data tersimpan di browser ini saja.</p>
      <div class="row-actions">
        <a class="secondary link-btn" :href="href('orders')">Lihat riwayat pesanan</a>
        <button class="danger" @click="out">Keluar dari akun</button>
      </div>
    </div>
  </section>
  <section v-else class="page empty-page">
    <Icon name="user" :size="40" /><h1>Kamu belum masuk</h1><p class="muted">Masuk atau daftar untuk melihat profil dan pengaturan akun.</p>
    <a class="primary link-btn" :href="href('login')">Masuk / Daftar</a>
  </section>
</template>
