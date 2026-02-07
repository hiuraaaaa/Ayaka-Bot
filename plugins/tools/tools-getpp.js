import fetch from 'node-fetch'

let handler = async (m, { conn, args }) => {
  try {
    let who

    if (m.isGroup) {
      if (m.mentionedJid[0]) {
        who = m.mentionedJid[0]
      } else if (args[0]) {
        who = args[0].replace(/\D/g, '') + '@s.whatsapp.net' // Format nomor jadi JID
      } else {
        who = m.sender
      }
    } else {
      who = args[0] ? args[0].replace(/\D/g, '') + '@s.whatsapp.net' : m.sender
    }

    let url = await conn.profilePictureUrl(who, 'image').catch(() => null)
    if (!url) return m.reply('Pp Nya Di Privasi atau Tidak Tersedia :(')

    await conn.sendFile(m.chat, url, 'profile.jpg', `@${who.split`@`[0]}`, m, null, { mentions: [who] })
  } catch (e) {
    console.error(e)
    m.reply('Terjadi kesalahan dalam mengambil PP.')
  }
}

handler.command = /^(get(pp|profile))$/i
handler.help = ['getprofile [@user | nomor]']
handler.tags = ['tools']
handler.limit = true

export default handler