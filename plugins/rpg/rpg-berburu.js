const cooldown = 1800000

let handler = async (m, {
	conn
}) => {
let user = global.db.data.users[m.sender]
	let _timie = (new Date - (user.lastberbru * 1)) * 1
  if (_timie < 1800000) return m.reply(`Kamu Sudah Lelah Untuk Berburu Mencari Mangsa\nTunggu Selama ${clockString(1800000 - _timie)} Lagi`)
  if (user.sniper < 1) return m.reply(`Kamu tidak memiliki Sniper untuk berburu.\nSilahkan Beli terlebih dahulu,`)
  if (user.peluru < 1) return m.reply(`Kamu Tidak Memiliki Peluru.\nSilahkan beli terlebih dahulu`)
  if (user.peluru < 30) return m.reply(`Peluru Kamu Kurang Dari 30.\nSilahkan Beli terlebih dahulu`)
	    else {
	//if (new Date - global.db.data.users[m.sender].lastberbru > 500000) {
		let randomaku1 = `${Math.floor(Math.random() * 10)}`
		let randomaku2 = `${Math.floor(Math.random() * 10)}`
		let randomaku4 = `${Math.floor(Math.random() * 10)}`
		let randomaku3 = `${Math.floor(Math.random() * 10)}`
		let randomaku5 = `${Math.floor(Math.random() * 10)}`
		let randomaku6 = `${Math.floor(Math.random() * 10)}`
		let randomaku7 = `${Math.floor(Math.random() * 10)}`
		let randomaku8 = `${Math.floor(Math.random() * 10)}`
		let randomaku9 = `${Math.floor(Math.random() * 10)}`
		let randomaku10 = `${Math.floor(Math.random() * 10)}`
		let randomaku11 = `${Math.floor(Math.random() * 10)}`
		let randomaku12 = `${Math.floor(Math.random() * 10)}`
		let randomaku13 = `${Math.floor(Math.random() * 30)}`
			.trim()

		let rbrb1 = (randomaku1 * 1)
		let rbrb2 = (randomaku2 * 1)
		let rbrb3 = (randomaku3 * 1)
		let rbrb4 = (randomaku4 * 1)
		let rbrb5 = (randomaku5 * 1)
		let rbrb6 = (randomaku6 * 1)
		let rbrb7 = (randomaku7 * 1)
		let rbrb8 = (randomaku8 * 1)
		let rbrb9 = (randomaku9 * 1)
		let rbrb10 = (randomaku10 * 1)
		let rbrb11 = (randomaku11 * 1)
		let rbrb12 = (randomaku12 * 1)
		let rbrb13 = (randomaku13 * 1)

		let anti1 = `${rbrb1}`
		let anti2 = `${rbrb2}`
		let anti3 = `${rbrb3}`
		let anti4 = `${rbrb4}`
		let anti5 = `${rbrb5}`
		let anti6 = `${rbrb6}`
		let anti7 = `${rbrb7}`
		let anti8 = `${rbrb8}`
	    let anti9 = `${rbrb9}`
		let anti10 = `${rbrb10}`
		let anti11 = `${rbrb11}`
		let anti12 = `${rbrb12}`
		let anti13 = `${rbrb13}`

		global.db.data.users[m.sender].banteng += rbrb1
		global.db.data.users[m.sender].harimau += rbrb2
		global.db.data.users[m.sender].gajah += rbrb3
		global.db.data.users[m.sender].kambing += rbrb4
		global.db.data.users[m.sender].panda += rbrb5
		global.db.data.users[m.sender].buaya += rbrb6
		global.db.data.users[m.sender].kerbau += rbrb7
		global.db.data.users[m.sender].sapi += rbrb8
		global.db.data.users[m.sender].monyet += rbrb9
		global.db.data.users[m.sender].babihutan += rbrb10
		global.db.data.users[m.sender].babi += rbrb11
		global.db.data.users[m.sender].ayam += rbrb12
		global.db.data.users[m.sender].peluru -= rbrb13
		global.db.data.users[m.sender].lastberbru = new Date * 1
		let nama = global.db.data.users[m.sender].name
		let peluru = global.db.data.users[m.sender].peluru
		let bru = `🤵🏻 ${nama} berburu menangkap hewan buas dan ternak`

		let hsl = `${bru}\nKamu Menghabiskan *🖍️${anti13}* Peluru


	*Ini Hasil Buruanmu*

 🐂 :  [${anti1}]					🐃 :  [${anti7}]
 🐅 :  [${anti2}]					🐄 :  [${anti8}]
 🐘 :  [${anti3}]					🐒 :  [${anti9}]
 🐐 :  [${anti4}]					🐗 :  [${anti10}]
 🐼 :  [${anti5}]					🐖 :  [${anti11}]
 🐊 :  [${anti6}]					🐔 :  [${anti12}]
 
 *Sisa Peluru :* ${peluru}
*Ketik:* _.kandang_ Untuk Melihat Hasilnya
`
				setTimeout(() => {
			conn.reply(m.chat, hsl, flok)
		}, 0)

		setTimeout(() => {
		let mentionedJid = [m.sender]
			conn.reply(m.chat, `Siapkan Snipermu @${m.sender.replace(/@.+/, '')}, dan ayo berburu kembali..`, flok, {contextInfo: { mentionedJid }})
		}, 1800000)
		}
}
handler.help = ['berburu']
handler.tags = ['rpg']
handler.command = /^(berburu)$/i
handler.register = true
handler.group = true
export default handler

function clockString(ms) {
  let h = isNaN(ms) ? '60' : Math.floor(ms / 3600000) % 60
  let m = isNaN(ms) ? '60' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '60' : Math.floor(ms / 1000) % 60
  return [h, m, s,].map(v => v.toString().padStart(2, 0) ).join(':')
}