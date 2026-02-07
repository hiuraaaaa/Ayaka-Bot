const timeout = 1800000

let handler = async (m, { conn, usedPrefix, args, text }) => {
  let type = (args[0] || '').toLowerCase()
  //let _type = (args[1] || '').toLowerCase()
  let user = global.db.data.users[m.sender]
  let caption = `*Ketik:* .mulung sampah`
	    let time = (new Date - (user.lastmulung * 1)) * 1
  if (time < 1800000) throw `Kamu Sudah Lelah Untuk Mencari Sampah\nTunggu Selama ${clockString(1800000 - time)} Lagi`
	let botolnye = `${Math.floor(Math.random() * 700)}`.trim()
	let kalengnye = `${Math.floor(Math.random() * 700)}`.trim()
	let kardusnye = `${Math.floor(Math.random() * 700)}`.trim()
	let pelastiknye = `${Math.floor(Math.random() * 700)}`.trim()
	global.db.data.users[m.sender].botol += botolnye * 1
	global.db.data.users[m.sender].kaleng += kalengnye * 1
	global.db.data.users[m.sender].kardus += kardusnye * 1
	global.db.data.users[m.sender].pelastik += pelastiknye * 1
	global.db.data.users[m.sender].lastmulung = new Date * 1
	user.totalmlung += 1;
	let mentionedJid = [m.sender]
  conn.reply(m.chat, `*Ini Hasil Dari @${m.sender.replace(/@.+/, '')} Membersihkan Setempat*\n🍶 *Botol :* ${botolnye}\n📦 *Kardus :* ${kardusnye}\n🗑️ *Kaleng :* ${kalengnye}\n🥡 *Plastik :* ${pelastiknye}\nCek Hasilmu Ketik .sampah`, flok, {contextInfo: { mentionedJid }})
  setTimeout(() => {
      let mentionedJid = [m.sender]
					conn.reply(m.chat, `Hei @${m.sender.replace(/@.+/, '')}, Sudah waktunya mulung kembali, Agar lingkungan bersih`, flok, {contextInfo: { mentionedJid }})
					}, timeout)
}
handler.help = ['mulung sampah']
handler.tags = ['rpg']
handler.command = /^(mulung)/i
handler.owner = false
handler.mods = false
handler.premium = false
handler.group = true
handler.private = false

handler.admin = false
handler.botAdmin = false

handler.fail = null
handler.limit = true
handler.exp = 0
handler.money = 0

export default handler

function clockString(ms) {
  let h = isNaN(ms) ? '60' : Math.floor(ms / 3600000) % 60
  let m = isNaN(ms) ? '60' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '60' : Math.floor(ms / 1000) % 60
  return [h, m, s,].map(v => v.toString().padStart(2, 0) ).join(':')
}