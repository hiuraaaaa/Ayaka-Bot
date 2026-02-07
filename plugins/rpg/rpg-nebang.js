const timeout = 3600000

let handler = async (m, { conn, usedPrefix, text }) => {
let user = global.db.data.users[m.sender]
  //      let timerand = `${Math.floor(Math.random() * 259200000)}`.trim()
	    let _timie = (new Date - (user.lastlumber * 1)) * 1
  if (_timie < 3600000) return m.reply(`Kamu Sudah Lelah Untuk *Menebang Pohon*\nTunggu Selama ${clockString(3600000 - _timie)} Lagi`)
   // if (global.db.data.users[m.sender].aqua > 9) {
   // let aquah = `${Math.floor(Math.random() * 5)}`.trim()
    let berlians = `${Math.floor(Math.random() * 70)}`.trim()
    let emasbiasas = `${Math.floor(Math.random() * 10)}`.trim()
    let emasbatangs = `${Math.floor(Math.random() * 10)}`.trim()
    let coal = `${Math.floor(Math.random() * 10)}`.trim()
    // global.db.data.users[m.sender].aqua -= aquah * 1
    global.db.data.users[m.sender].kayu += berlians * 1
    global.db.data.users[m.sender].string += emasbiasas * 1
    global.db.data.users[m.sender].coal += coal * 1
    global.db.data.users[m.sender].common += 1
	global.db.data.users[m.sender].lastlumber = new Date * 1
	let mentionedJid = [m.sender]
  conn.reply(m.chat, `Ini Hasil Kamu @${m.sender.replace(/@.+/, '')} Menebang Pohon: \n🪵 *Kayu:* +${berlians}\n🕸️ *String :* +${emasbiasas}\n🪨 *Coal :* +${coal}\n\n📦 *Common :* +1`, flok, {contextInfo: { mentionedJid }})
  setTimeout(() => {
        let mentionedJid = [m.sender]
		conn.reply(m.chat, `Yuu kak @${m.sender.replace(/@.+/, '')} kita kumpulkan kayu lagi, untuk kebutuhan..`, flok, {contextInfo: { mentionedJid }})
					}, 3600000)
}
handler.help = ['nebang']
handler.tags = ['rpg']
handler.command = /^(nebang)/i
handler.group = true
handler.register = true

handler.limit = true

export default handler 

function clockString(ms) {
  let h = isNaN(ms) ? '60' : Math.floor(ms / 3600000) % 60
  let m = isNaN(ms) ? '60' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '60' : Math.floor(ms / 1000) % 60
  return [h, m, s,].map(v => v.toString().padStart(2, 0) ).join(':')
}