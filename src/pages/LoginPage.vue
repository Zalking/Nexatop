<script setup>
import { reactive, ref } from 'vue'
import { login, notify, register } from '../lib/store'
import { go } from '../lib/router'
import Icon from '../components/Icon.vue'

const mode = ref('login')
const f = reactive({ name: '', email: '', phone: '' })
const error = ref('')
function submit() {
  error.value = ''
  if (!/^\S+@\S+\.\S+$/.test(f.email)) return (error.value = 'Masukkan email yang valid.')
  if (mode.value === 'register' && !f.name.trim()) return (error.value = 'Nama wajib diisi.')
  const res = mode.value === 'login' ? login(f.email) : register(f)
  if (!res.ok) return (error.value = res.reason)
  notify(mode.value === 'login' ? 'Selamat datang kembali!' : 'Akun berhasil dibuat.')
  go('profile')
}
</script>

<template>
  <section class="page auth-page">
    <div class="panel auth-card">
      <div class="eyebrow">{{ mode === 'login' ? 'MASUK' : 'DAFTAR' }}</div>
      <h1>{{ mode === 'login' ? 'Selamat datang' : 'Buat akun NexaTop' }}</h1>
      <p class="muted">Akun demo: <b>raka@example.com</b> (tanpa kata sandi, hanya prototype).</p>
      <form class="auth-form" @submit.prevent="submit">
        <div v-if="mode === 'register'" class="form-field"><label for="an">Nama lengkap</label><input id="an" v-model="f.name" class="field" autocomplete="name" /></div>
        <div class="form-field"><label for="ae">Email</label><input id="ae" v-model="f.email" class="field" type="email" autocomplete="email" /></div>
        <div v-if="mode === 'register'" class="form-field"><label for="ap">No. WhatsApp</label><input id="ap" v-model="f.phone" class="field" inputmode="tel" /></div>
        <p v-if="error" class="voucher-err"><Icon name="alert-circle" :size="14" /> {{ error }}</p>
        <button class="primary submit center" type="submit">{{ mode === 'login' ? 'Masuk' : 'Daftar' }}</button>
      </form>
      <p class="muted center-text">
        {{ mode === 'login' ? 'Belum punya akun?' : 'Sudah punya akun?' }}
        <button class="link" @click="mode = mode === 'login' ? 'register' : 'login'; error = ''">{{ mode === 'login' ? 'Daftar' : 'Masuk' }}</button>
      </p>
    </div>
  </section>
</template>
