// Data pendukung: voucher, metode pembayaran, FAQ, dan pengguna demo.
export const vouchers = [
  { code: 'NEXA10', title: 'Diskon 10% semua game', type: 'percent', value: 10, max: 15000, min: 20000, games: [], active: true, expires: '2026-12-31', note: 'Maks. potongan Rp15.000' },
  { code: 'HEMAT5K', title: 'Potongan Rp5.000', type: 'flat', value: 5000, max: 5000, min: 50000, games: [], active: true, expires: '2026-12-31', note: 'Min. belanja Rp50.000' },
  { code: 'ML15', title: 'Diskon 15% Mobile Legends', type: 'percent', value: 15, max: 25000, min: 30000, games: ['ml'], active: true, expires: '2026-12-31', note: 'Khusus Mobile Legends' },
  { code: 'FFBOOM', title: 'Diskon 12% Free Fire', type: 'percent', value: 12, max: 20000, min: 19000, games: ['ff'], active: true, expires: '2026-12-31', note: 'Khusus Free Fire' },
  { code: 'NEWUSER', title: 'Diskon 20% pesanan pertama', type: 'percent', value: 20, max: 30000, min: 20000, games: [], active: true, expires: '2026-12-31', firstOrder: true, note: 'Hanya untuk pesanan pertama' },
  { code: 'LAMA2025', title: 'Promo akhir tahun lalu', type: 'percent', value: 25, max: 40000, min: 10000, games: [], active: true, expires: '2025-12-31', note: 'Sudah berakhir' }
]

export const paymentMethods = [
  { id: 'bca', group: 'Transfer Bank', name: 'Bank Nexa (BCA demo)', fee: 0, account: '123 456 7890', holder: 'PT Nexa Digital', icon: 'credit-card' },
  { id: 'mandiri', group: 'Transfer Bank', name: 'Bank Mandiri (demo)', fee: 0, account: '098 765 4321', holder: 'PT Nexa Digital', icon: 'credit-card' },
  { id: 'dana', group: 'E-Wallet', name: 'DANA (demo)', fee: 1000, account: '0812 3456 7890', holder: 'NexaTop Official', icon: 'smartphone' },
  { id: 'qris', group: 'QRIS', name: 'QRIS (demo)', fee: 1500, account: 'Scan QR pada layar', holder: 'NexaTop Official', icon: 'grid' }
]

export const faqs = [
  { cat: 'Pemesanan', q: 'Bagaimana cara top up di NexaTop?', a: 'Pilih game, pilih nominal, isi User ID (dan Zone ID bila diminta), lanjut ke checkout, transfer sesuai total, lalu unggah bukti pembayaran. Admin akan memverifikasi pesananmu.' },
  { cat: 'Pemesanan', q: 'Di mana saya menemukan User ID dan Zone ID?', a: 'Buka profil di dalam game. Pada Mobile Legends, User ID dan Zone ID tampil di samping nama karakter, contoh 12345678 (1234).' },
  { cat: 'Pemesanan', q: 'Bisakah saya membatalkan pesanan?', a: 'Pesanan dengan status "Menunggu verifikasi" dapat dibatalkan lewat halaman detail pesanan. Pesanan yang sudah diverifikasi tidak bisa dibatalkan.' },
  { cat: 'Pembayaran', q: 'Metode pembayaran apa yang tersedia?', a: 'Transfer bank, e-wallet, dan QRIS. Semua pembayaran bersifat manual: unggah bukti transfer agar admin dapat memverifikasi.' },
  { cat: 'Pembayaran', q: 'Berapa lama verifikasi pembayaran?', a: 'Rata-rata 5–15 menit pada jam operasional 08.00–23.00 WIB. Di luar jam tersebut, pesanan diproses di pagi hari.' },
  { cat: 'Pembayaran', q: 'Bukti transfer saya ditolak, apa yang harus dilakukan?', a: 'Pastikan nominal sesuai total bayar dan foto bukti terlihat jelas. Buat pesanan baru dengan bukti yang benar atau hubungi bantuan.' },
  { cat: 'Voucher', q: 'Bagaimana cara memakai voucher?', a: 'Masukkan kode voucher di halaman checkout lalu tekan "Pakai". Diskon dihitung otomatis jika syarat minimal belanja dan game terpenuhi.' },
  { cat: 'Voucher', q: 'Kenapa voucher saya tidak bisa dipakai?', a: 'Periksa masa berlaku, minimal belanja, dan game yang berlaku. Voucher NEWUSER hanya untuk pesanan pertama.' },
  { cat: 'Akun', q: 'Apakah saya harus membuat akun?', a: 'Tidak wajib untuk memesan, tetapi dengan akun kamu bisa melihat riwayat pesanan dan menyimpan data profil.' },
  { cat: 'Akun', q: 'Bagaimana jika top up belum masuk?', a: 'Cek status di halaman Riwayat Pesanan. Jika status sudah "Berhasil" namun item belum masuk, restart game lalu hubungi bantuan dengan ID pesanan.' }
]

export const seedUsers = [
  { id: 'u-demo', name: 'Raka Pratama', email: 'raka@example.com', phone: '081234567890', role: 'user', joinedAt: '2026-08-14', status: 'active' },
  { id: 'u-2', name: 'Salsa Nabila', email: 'salsa@example.com', phone: '081298765432', role: 'user', joinedAt: '2026-09-02', status: 'active' },
  { id: 'u-3', name: 'Dimas Aditya', email: 'dimas@example.com', phone: '082111222333', role: 'user', joinedAt: '2026-09-21', status: 'active' },
  { id: 'u-4', name: 'Putri Anjani', email: 'putri@example.com', phone: '085777888999', role: 'user', joinedAt: '2026-10-05', status: 'blocked' }
]
