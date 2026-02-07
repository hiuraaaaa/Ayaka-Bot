let handler = async (m, { conn, text, usedPrefix, command }) => {
  // pastikan data grup sudah ada di database
  if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {}

  // validasi grup
  if (!m.isGroup) return m.reply('⚠️ Fitur ini hanya bisa digunakan di grup!')

  // validasi input kosong
  if (!text) {
    return m.reply(
      `❌ Format salah!\n\nContoh:\n${usedPrefix + command} on\n${usedPrefix + command} off`
    )
  }

  let chat = global.db.data.chats[m.chat]
  text = text.toLowerCase()

  if (text === 'off') {
    if (chat.isBanned) return m.reply('_⚠️ Bot sudah offline di grup ini!_')
    global.db.data.chats[m.chat].isBanned = true
    return conn.reply(m.chat, '✅ Bot berhasil *offline* di grup ini.', m)
  } else if (text === 'on') {
    if (!chat.isBanned) return m.reply('_⚠️ Bot sudah online di grup ini!_')
    global.db.data.chats[m.chat].isBanned = false
    return conn.reply(m.chat, '✅ Bot berhasil *online* di grup ini.', m)
  } else {
    return m.reply(
      `❌ Format salah!\n\nGunakan:\n${usedPrefix + command} on\n${usedPrefix + command} off`
    )
  }
}

handler.help = ['bot <on/off>']
handler.tags = ['group']
handler.command = /^bot$/i
handler.group = true
handler.admin = true

export default handler