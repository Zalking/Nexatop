import ml from '../assets/mlbb.jpg'
import ff from '../assets/free fire.jpe'
import pubg from '../assets/pubg.jpe'
import genshin from '../assets/genshin.jpe'
import hok from '../assets/honor.jpe'
import roblox from '../assets/roblox.jpe'
import codm from '../assets/codm.jpg'
import valorant from '../assets/valorant.jpe'

export const games = [
  { id: 'ml', name: 'Mobile Legends', category: 'MOBA · Diamonds', image: ml, currency: 'Diamonds', needsZone: true, nominals: [{ label: '86 Diamonds', price: 20000 }, { label: '172 Diamonds', price: 39000 }, { label: '257 Diamonds', price: 58000 }, { label: '344 Diamonds', price: 77000 }, { label: '514 Diamonds', price: 114000 }, { label: '878 Diamonds', price: 192000 }] },
  { id: 'ff', name: 'Free Fire', category: 'Battle Royale · Diamonds', image: ff, currency: 'Diamonds', needsZone: false, nominals: [{ label: '70 Diamonds', price: 10000 }, { label: '140 Diamonds', price: 19000 }, { label: '355 Diamonds', price: 47000 }, { label: '720 Diamonds', price: 93000 }, { label: '1450 Diamonds', price: 185000 }, { label: '2180 Diamonds', price: 275000 }] },
  { id: 'pubg', name: 'PUBG Mobile', category: 'Battle Royale · UC', image: pubg, currency: 'UC', needsZone: false, nominals: [{ label: '60 UC', price: 16000 }, { label: '325 UC', price: 78000 }, { label: '660 UC', price: 155000 }, { label: '1800 UC', price: 390000 }, { label: '3850 UC', price: 770000 }, { label: '8100 UC', price: 1550000 }] },
  { id: 'genshin', name: 'Genshin Impact', category: 'RPG · Genesis Crystals', image: genshin, currency: 'Crystals', needsZone: true, nominals: [{ label: '60 Crystals', price: 16000 }, { label: '300 + 30', price: 79000 }, { label: '980 + 110', price: 239000 }, { label: '1980 + 260', price: 479000 }, { label: '3280 + 600', price: 779000 }, { label: '6480 + 1600', price: 1559000 }] },
  { id: 'hok', name: 'Honor of Kings', category: 'MOBA · Tokens', image: hok, currency: 'Tokens', needsZone: false, nominals: [{ label: '80 Tokens', price: 15000 }, { label: '240 Tokens', price: 45000 }, { label: '400 Tokens', price: 73000 }, { label: '800 Tokens', price: 145000 }, { label: '1200 Tokens', price: 215000 }, { label: '2400 Tokens', price: 425000 }] },
  { id: 'roblox', name: 'Roblox', category: 'Sandbox · Robux', image: roblox, currency: 'Robux', needsZone: false, nominals: [{ label: '80 Robux', price: 18000 }, { label: '160 Robux', price: 35000 }, { label: '400 Robux', price: 85000 }, { label: '800 Robux', price: 165000 }, { label: '1700 Robux', price: 340000 }, { label: '4500 Robux', price: 850000 }] },
  { id: 'codm', name: 'Call of Duty Mobile', category: 'FPS · CP', image: codm, currency: 'CP', needsZone: false, nominals: [{ label: '31 CP', price: 10000 }, { label: '62 CP', price: 18000 }, { label: '127 CP', price: 35000 }, { label: '320 CP', price: 78000 }, { label: '645 CP', price: 150000 }, { label: '1373 CP', price: 310000 }] },
  { id: 'valorant', name: 'Valorant', category: 'FPS · VP', image: valorant, currency: 'VP', needsZone: false, nominals: [{ label: '125 VP', price: 15000 }, { label: '420 VP', price: 50000 }, { label: '700 VP', price: 80000 }, { label: '1375 VP', price: 150000 }, { label: '2400 VP', price: 250000 }, { label: '4000 VP', price: 410000 }] }
]

export const rupiah = (value) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value)
export const statusLabel = (status) => ({ pending: 'Menunggu verifikasi', paid: 'Terverifikasi', done: 'Berhasil', rejected: 'Ditolak' }[status] || status)

// Metadata tambahan untuk halaman detail, katalog, dan beranda (tidak mengubah daftar game di atas)
export const gameMeta = {
  ml: { popular: true, rating: 4.9, sold: '2,1 jt', platforms: ['mobile'], desc: 'Top up Diamonds Mobile Legends: Bang Bang. Masukkan User ID dan Zone ID, pilih paket, lalu bayar manual.', tag: 'TERLARIS' },
  ff: { popular: true, rating: 4.8, sold: '1,8 jt', platforms: ['mobile'], desc: 'Top up Diamonds Free Fire untuk skin, karakter, dan Elite Pass. Cukup dengan Player ID.', tag: 'HOT' },
  pubg: { popular: true, rating: 4.8, sold: '1,2 jt', platforms: ['mobile'], desc: 'Beli UC PUBG Mobile untuk Royale Pass, skin senjata, dan crate favoritmu.', tag: '' },
  genshin: { popular: true, rating: 4.9, sold: '860 rb', platforms: ['mobile', 'pc', 'console'], desc: 'Genesis Crystals dan Welkin untuk Genshin Impact. Pilih server UID dengan benar.', tag: 'BONUS' },
  hok: { popular: false, rating: 4.7, sold: '420 rb', platforms: ['mobile'], desc: 'Top up Tokens Honor of Kings untuk hero, skin, dan event spesial.', tag: 'BARU' },
  roblox: { popular: false, rating: 4.7, sold: '610 rb', platforms: ['mobile', 'pc'], desc: 'Robux Roblox untuk item avatar, game pass, dan pengalaman premium.', tag: '' },
  codm: { popular: true, rating: 4.8, sold: '940 rb', platforms: ['mobile'], desc: 'COD Points Call of Duty: Mobile untuk Battle Pass, skin senjata, dan crate.', tag: '' },
  valorant: { popular: false, rating: 4.8, sold: '530 rb', platforms: ['pc'], desc: 'Valorant Points untuk skin senjata dan Battle Pass. Gunakan Riot ID.', tag: 'PC' }
}

export const genreOf = (game) => String(game.category).split(' · ')[0]

export const platformLabels = { mobile: 'Mobile', pc: 'PC', console: 'Console' }
