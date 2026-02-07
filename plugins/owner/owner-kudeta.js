let handler = async (m, { conn, participants }) => {
  const nomorOwner = global.nomorwa?.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
  const botJid = conn.decodeJid(conn.user.id)
  const senderJid = m.sender

  if (!m.isGroup) throw '❌ Fitur ini hanya bisa digunakan di grup.'
  if (!nomorOwner) throw '❌ Nomor owner belum disetel di global.nomorwa.'
  if (!participants.find(p => p.id === botJid)?.admin) throw '❌ Bot bukan admin.'
  if (senderJid !== nomorOwner) throw '❌ Hanya owner yang bisa melakukan kudeta.'

  const ownerJid = nomorOwner

  const ownerData = participants.find(p => p.id === ownerJid)
  if (ownerData && !ownerData.admin) {
    await conn.groupParticipantsUpdate(m.chat, [ownerJid], 'promote')
  }

  const targetKick = participants
    .filter(p => p.id !== botJid && p.id !== ownerJid)
    .map(p => p.id)

  if (targetKick.length === 0) {
    return m.reply('✅ Tidak ada member lain yang bisa ditendang.')
  }

  await m.reply(`💣 *Kudeta dimulai!*\n👑 Menjaga kekuasaan...\n🚪 Menendang ${targetKick.length} member...`)

  for (let user of targetKick) {
    await conn.groupParticipantsUpdate(m.chat, [user], 'remove').catch(() => {})
    await new Promise(resolve => setTimeout(resolve, 1000)) 
  }

  await m.reply(`✅ *Kudeta selesai!*\n👑 Hanya bot & owner yang tersisa di grup.`)
}

handler.help = ['kudeta']
handler.tags = ['group']
handler.command = /^kudeta$/i
handler.group = true
handler.owner = true

export default handler