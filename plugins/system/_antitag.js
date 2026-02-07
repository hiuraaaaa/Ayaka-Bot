const handler = m => m

handler.before = async function (m, { isAdmin, isBotAdmin }) {
  if (m.isBaileys && m.fromMe) return true
  
  const chat = global.db.data.chats[m.chat]
  const messageId = m.key.id
  const participant = m.key.participant

  // Cek apakah fitur anti tag aktif di chat
  if (chat.antitag && m.mentionedJid.length > 0) {
    if (isAdmin || !isBotAdmin) {
      // Jika pengirim adalah admin atau bot bukan admin, tidak melakukan apa-apa
      return true
    } else {
      // Menghapus pesan yang berisi tag
      return this.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: messageId, participant: participant } })
    }
  }

  return true
}

export default handler