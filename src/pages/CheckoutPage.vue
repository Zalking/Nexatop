<script setup>
import { computed, ref } from 'vue'
import { rupiah } from '../data/games'
import { paymentMethods } from '../data/extras'
import { createOrder, draftGame, draftMethod, draftNominal, draftPricing, evaluateVoucher, notify, resetDraft, state } from '../lib/store'
import { go, href } from '../lib/router'
import Icon from '../components/Icon.vue'

const proofPreview = ref('')
const proofName = ref('')
const voucherInput = ref(state.draft.voucher || '')
const voucherInfo = ref(null)
const submitting = ref(false)
const ready = computed(() => draftGame.value && draftNominal.value && state.draft.playerId.trim())
const groups = computed(() => [...new Set(paymentMethods.map((m) => m.group))])

function applyVoucher() {
  const res = evaluateVoucher(voucherInput.value, draftGame.value, draftPricing.value.subtotal)
  voucherInfo.value = res
  if (res.ok) {
    state.draft.voucher = res.voucher.code
    notify(`Voucher ${res.voucher.code} dipakai: hemat ${rupiah(res.discount)}`)
  } else {
    state.draft.voucher = ''
    notify(res.reason)
  }
}
function removeVoucher() {
  state.draft.voucher = ''
  voucherInput.value = ''
  voucherInfo.value = null
}
function onProofChange(event) {
  const file = event.target.files?.[0]
  if (!file) { proofPreview.value = ''; proofName.value = ''; return }
  if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
    event.target.value = ''
    return notify('Gunakan file PNG, JPG, atau WEBP.')
  }
  if (file.size > 5 * 1024 * 1024) {
    event.target.value = ''
    return notify('Ukuran bukti maksimal 5 MB.')
  }
  const reader = new FileReader()
  reader.onload = () => { proofPreview.value = String(reader.result || ''); proofName.value = file.name }
  reader.readAsDataURL(file)
}
function submit() {
  if (submitting.value) return
  const d = state.draft
  if (!draftGame.value || !draftNominal.value) return notify('Pilih game dan nominal terlebih dahulu.')
  if (!d.playerId.trim() || !d.buyer.trim() || !d.contact.trim()) return notify('Lengkapi User ID, nama, dan kontak.')
  if (draftGame.value.needsZone && !d.zoneId.trim()) return notify('Game ini memerlukan Zone / Server ID.')
  if (!proofPreview.value) return notify('Unggah bukti transfer terlebih dahulu.')
  submitting.value = true
  const order = createOrder(proofPreview.value)
  resetDraft()
  notify(`Pesanan ${order.id} berhasil dibuat (demo).`)
  go('order/' + order.id)
}
</script>

<template>
  <section v-if="ready" class="page">
    <div class="page-head">
      <div><div class="eyebrow">CHECKOUT</div><h1>Selesaikan pembayaran</h1><p class="muted">Periksa pesanan, pilih metode, lalu unggah bukti transfer.</p></div>
      <a class="secondary link-btn" :href="href('game/' + draftGame.id)"><Icon name="arrow-left" :size="15" /> Ubah pesanan</a>
    </div>

    <div class="content-grid">
      <div class="panel">
        <div class="selected-heading">
          <img class="selected-thumb" :src="draftGame.image" :alt="`Artwork ${draftGame.name}`" />
          <div>
            <h3>{{ draftGame.name }}</h3>
            <p class="muted">{{ draftNominal.label }} · ID {{ state.draft.playerId }}<span v-if="state.draft.zoneId"> ({{ state.draft.zoneId }})</span></p>
          </div>
        </div>

        <div class="step"><span>1</span> DATA PEMESAN</div>
        <div class="form-grid">
          <div class="form-field wide">
            <label for="buyerName">Nama pemesan *</label>
            <input id="buyerName" v-model="state.draft.buyer" class="field" placeholder="Nama kamu" autocomplete="name" />
          </div>
          <div class="form-field wide">
            <label for="buyerContact">Kontak (WhatsApp / email) *</label>
            <input id="buyerContact" v-model="state.draft.contact" class="field" placeholder="08xx atau email" autocomplete="email" />
          </div>
        </div>

        <div class="step"><span>2</span> VOUCHER</div>
        <div class="voucher-box">
          <input v-model="voucherInput" class="field" placeholder="Masukkan kode voucher" aria-label="Kode voucher" @keyup.enter="applyVoucher" />
          <button class="secondary" @click="applyVoucher">Pakai</button>
        </div>
        <p v-if="state.draft.voucher" class="voucher-ok"><Icon name="check-circle" :size="14" /> {{ state.draft.voucher }} aktif · hemat {{ rupiah(draftPricing.discount) }}
          <button class="link" @click="removeVoucher">Hapus</button></p>
        <p v-else-if="voucherInfo && !voucherInfo.ok" class="voucher-err"><Icon name="x-circle" :size="14" /> {{ voucherInfo.reason }}</p>
        <p v-else class="notice">Punya kode? Lihat daftar di <a :href="href('promo')">halaman promo</a>.</p>

        <div class="step"><span>3</span> METODE PEMBAYARAN</div>
        <div v-for="grp in groups" :key="grp" class="pay-group">
          <small class="muted">{{ grp }}</small>
          <div class="pay-grid">
            <label v-for="m in paymentMethods.filter((x) => x.group === grp)" :key="m.id" class="pay-option" :class="{ on: state.draft.method === m.id }">
              <input v-model="state.draft.method" type="radio" name="method" :value="m.id" />
              <Icon :name="m.icon" :size="18" />
              <span><b>{{ m.name }}</b><em>{{ m.fee ? 'Biaya ' + rupiah(m.fee) : 'Tanpa biaya' }}</em></span>
            </label>
          </div>
        </div>

        <div class="pay-instruction">
          <small>Transfer tepat sebesar</small>
          <strong>{{ rupiah(draftPricing.total) }}</strong>
          <p><b>{{ draftMethod.name }}</b> · {{ draftMethod.account }} · a.n. {{ draftMethod.holder }}</p>
          <p class="notice">Data rekening di atas adalah ilustrasi demo, bukan rekening pembayaran nyata.</p>
        </div>

        <div class="step"><span>4</span> UNGGAH BUKTI TRANSFER</div>
        <div class="file-drop">
          <div class="upload-icon"><Icon name="upload" :size="20" /></div>
          <strong>Unggah bukti transfer</strong>
          <p class="muted">PNG, JPG, atau WEBP · Maks. 5 MB</p>
          <label class="upload-button">Pilih gambar<input id="proofFile" type="file" accept="image/png,image/jpeg,image/webp" @change="onProofChange" /></label>
          <p v-if="proofName" class="muted small">{{ proofName }}</p>
          <img v-if="proofPreview" :src="proofPreview" class="proof-preview" alt="Pratinjau bukti transfer" />
        </div>
      </div>

      <aside class="panel summary-panel">
        <div class="summary-title">
          <div><h3>Ringkasan pembayaran</h3><p class="muted">Pastikan detail sudah sesuai.</p></div>
          <span>02</span>
        </div>
        <div class="summary-line"><span>Game</span><strong>{{ draftGame.name }}</strong></div>
        <div class="summary-line"><span>Nominal</span><strong>{{ draftNominal.label }}</strong></div>
        <div class="summary-line"><span>Harga</span><strong>{{ rupiah(draftPricing.subtotal) }}</strong></div>
        <div class="summary-line"><span>Diskon voucher</span><strong class="green">{{ draftPricing.discount ? '−' + rupiah(draftPricing.discount) : rupiah(0) }}</strong></div>
        <div class="summary-line"><span>Biaya layanan</span><strong>{{ rupiah(draftPricing.fee) }}</strong></div>
        <div class="summary-line total"><span>Total bayar</span><strong>{{ rupiah(draftPricing.total) }}</strong></div>
        <button class="primary submit center" :disabled="submitting" @click="submit">Buat Pesanan <Icon name="arrow-up-right" :size="16" /></button>
        <p class="notice">Status awal pesanan adalah <b>Menunggu verifikasi</b>. Prototype ini menyimpan data di browser, belum terhubung ke server atau payment gateway.</p>
        <a class="secondary submit center link-btn" :href="href('orders')">Lihat pesanan saya ({{ state.orders.length }})</a>
      </aside>
    </div>
  </section>

  <section v-else class="page empty-page">
    <Icon name="shopping-cart" :size="40" />
    <h1>Checkout kosong</h1>
    <p class="muted">Pilih game, nominal, dan isi User ID terlebih dahulu.</p>
    <a class="primary link-btn" :href="href('games')">Pilih game</a>
  </section>
</template>
