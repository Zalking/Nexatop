<script setup>
import { computed, ref } from 'vue'
import { faqs } from '../data/extras'
import { notify } from '../lib/store'
import Icon from '../components/Icon.vue'

const q = ref('')
const cat = ref('Semua')
const open = ref(0)
const cats = ['Semua', ...new Set(faqs.map((f) => f.cat))]
const list = computed(() => faqs.filter((f) => (cat.value === 'Semua' || f.cat === cat.value) && `${f.q} ${f.a}`.toLowerCase().includes(q.value.toLowerCase())))
const contact = ref({ name: '', email: '', msg: '' })
function send() {
  if (!contact.value.name.trim() || !/^\S+@\S+\.\S+$/.test(contact.value.email) || contact.value.msg.trim().length < 10) return notify('Lengkapi nama, email valid, dan pesan (min. 10 karakter).')
  notify('Pesan terkirim (demo). Tim kami akan membalas lewat email.')
  contact.value = { name: '', email: '', msg: '' }
}
</script>

<template>
  <section id="help-page" class="page">
    <div class="page-head">
      <div><div class="eyebrow">PUSAT BANTUAN</div><h1>Ada yang bisa kami bantu?</h1><p class="muted">Cari jawaban cepat atau hubungi tim NexaTop.</p></div>
      <input v-model="q" class="field search" placeholder="Cari pertanyaan..." aria-label="Cari FAQ" @input="open = 0" />
    </div>
    <div class="help-grid">
      <a class="help-card" href="mailto:infomail@gmail.com"><Icon name="mail" :size="22" /><b>Email</b><small class="muted">infomail@gmail.com</small></a>
      <a class="help-card" href="#/help" @click.prevent="notify('WhatsApp CS: 0812-0000-0000 (nomor demo)')"><Icon name="message-circle" :size="22" /><b>WhatsApp</b><small class="muted">08.00–23.00 WIB</small></a>
      <a class="help-card" href="#/orders"><Icon name="package" :size="22" /><b>Lacak pesanan</b><small class="muted">Cek status transaksi</small></a>
    </div>
    <div class="chips" role="group" aria-label="Kategori FAQ">
      <button v-for="c in cats" :key="c" class="chip" :class="{ on: cat === c }" @click="cat = c; open = 0">{{ c }}</button>
    </div>
    <div class="faq">
      <div v-for="(f, i) in list" :key="f.q" class="faq-item" :class="{ open: open === i }">
        <button :aria-expanded="open === i" @click="open = open === i ? -1 : i"><span>{{ f.q }}</span><Icon name="chevron-down" :size="18" /></button>
        <p v-show="open === i">{{ f.a }}</p>
      </div>
      <div v-if="!list.length" class="empty">Tidak ada pertanyaan yang cocok.</div>
    </div>
    <div class="panel narrow contact">
      <h3>Belum menemukan jawaban?</h3>
      <p class="muted">Kirim pesan dan kami balas secepatnya.</p>
      <div class="form-grid mt">
        <div class="form-field"><label for="cn">Nama</label><input id="cn" v-model="contact.name" class="field" /></div>
        <div class="form-field"><label for="ce">Email</label><input id="ce" v-model="contact.email" class="field" type="email" /></div>
        <div class="form-field wide"><label for="cm">Pesan</label><textarea id="cm" v-model="contact.msg" class="field" rows="4"></textarea></div>
      </div>
      <button class="primary mt" @click="send">Kirim pesan</button>
    </div>
  </section>
</template>
