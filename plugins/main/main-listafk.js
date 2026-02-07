var handler = async (m, { conn }) => {
  let users = global.db.data.users
  let now = +new Date()
  let afkThreshold = 1000 * 60 * 60 * 24 * 7

  let afkUsers = Object.entries(users)
    .filter(([_, user]) => typeof user.afk === 'number' && now - user.afk <= afkThreshold)

  if (afkUsers.length === 0)
    return await conn.reply(m.chat, '*Tidak ada yang sedang AFK dalam 7 hari terakhir.*', m)

  let limited = afkUsers.slice(0, 30)

  let caption = `*Daftar Pengguna AFK (7 Hari Terakhir):*\n\n` + limited.map(([jid, user], i) => {
    return `${i + 1}. *${user.name || 'Tanpa Nama'}*
  ┗ 📝 Alasan: ${user.afkReason || 'Tanpa Alasan'}
  ┗ 🕓 Jam: ${user.afkTime || '-'}
  ┗ 🆔: @${jid.split('@')[0]}`
  }).join('\n\n')

  let mentionedJid = limited.map(([jid]) => jid)

  await conn.reply(m.chat, caption, null, {
    contextInfo: {
      mentionedJid,
      externalAdReply: {
        title: "List Afk ⛈️",
        thumbnail: await (await conn.getFile("https://cdn-icons-png.flaticon.com/128/6012/6012311.png")).data,
      }
    }
  })
}

handler.help = ['listafk']
handler.tags = ['main']
handler.command = /^listafk$/i

export default handler