let handler = async (m, { conn, text }) => {
  let chats = global.db.data.chats

  if (text) {
    let id = text.trim()

    id = id.replace(/\s+/g, '')
    if (!id.endsWith('@g.us')) id = id.replace(/@.*$/, '') + '@g.us'

    if (!chats[id]) chats[id] = {}

    chats[id].isBanned = false

    return m.reply(`✅ Grup *${id}* berhasil diaktifkan kembali!`)
  }

  let groups = Object.entries(conn.chats)
    .filter(([jid]) => jid.endsWith('@g.us'))
    .map(([jid, chat]) => ({
      jid,
      subject: chat.subject || 'Tanpa Nama',
      banned: chats[jid]?.isBanned ? '🚫' : '✅'
    }))

  if (!groups.length) return m.reply('❌ Tidak ada grup aktif yang terdeteksi.')

  let listText = `📜 *Daftar Grup Terhubung*\n\n` +
    groups.map((g, i) => `${i + 1}. ${g.banned} *${g.subject}*\n   ID: ${g.jid}`).join('\n\n') +
    `\n\n📝 Gunakan perintah:\n.unbanchat2 <id grup>\ncontoh:\n.unbanchat2 1203630xxxxxx@g.us`

  m.reply(listText)
}

handler.help = ['unbanchat2 [id grup]']
handler.tags = ['owner']
handler.command = /^(unbanchat2|ubnc2)$/i
handler.owner = true

export default handler