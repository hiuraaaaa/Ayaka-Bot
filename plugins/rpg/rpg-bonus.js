let handler = async (m, { conn }) => {
  if (new Date - global.db.data.users[m.sender].lastclaim > 86400000) {
  let mentionedJid = [m.sender]
    let ster = `Selamat Kak @${m.sender.replace(/@.+/, '')}, Kamu Mendapatkan: Rp.200.000`
    global.db.data.users[m.sender].money += 200000
    global.db.data.users[m.sender].lastclaim = new Date * 1
    conn.reply(m.chat, ster, flok, {contextInfo: { mentionedJid }})
  } else conn.reply(m.chat, `Blum waktunya`, flok)
}
handler.help = ['hadiah']
handler.tags = ['rpg']
handler.command = /^(bonus|hadiah)$/i
handler.owner = false
handler.mods = false
handler.premium = false
handler.group = true
handler.private = false

handler.admin = false
handler.botAdmin = false

handler.fail = null
handler.exp = 0

export default handler