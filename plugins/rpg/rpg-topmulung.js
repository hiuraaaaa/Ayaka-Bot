let handler = async (m, { conn }) => {
  const emojis = ['🥇', '🥈', '🥉', '🏅', '🏅', '🏅', '🎖️', '🎖️', '🎖️', '🎖️']
  
  let users = Object.entries(global.db.data.users)
    .map(([jid, user]) => {
      let totalItem = (user.botol || 0) + (user.kaleng || 0) + (user.kardus || 0) + (user.pelastik || 0)
      return { jid, totalItem }
    })
    .filter(user => user.totalItem > 0)
    .sort((a, b) => b.totalItem - a.totalItem)
    .slice(0, 10)

  if (users.length === 0) return conn.reply(m.chat, 'Belum ada yang mulung sampah.', flok)

  let teks = `🌟 *TOP 10 PEMULUNG GLOBAL* 🌟\n\n`
  let mentionedJid = []

  for (let i = 0; i < users.length; i++) {
    let tag = '@' + users[i].jid.replace(/@.+/, '')
    teks += `${emojis[i] || '🔹'} ${i + 1}. ${tag} - ${users[i].totalItem} sampah\n`
    mentionedJid.push(users[i].jid)
  }

  teks += `\n> _Semangat mulung nya yah >\\<_`

  conn.reply(m.chat, teks.trim(), flok, { contextInfo: { mentionedJid } })
}

handler.help = ['lbmulung']
handler.tags = ['rpg']
handler.command = /^lbmulung$/i
handler.group = false

export default handler