let handler = async (m, { args }) => {
  const command = (args[0] || '').toLowerCase()

  if (command === 'on') {
    global.db.data.chats[m.chat].isBanned = true
    return m.reply('❗Bot telah dimute oleh admin')
  }

  if (command === 'off') {
    global.db.data.chats[m.chat].isBanned = false
    return m.reply('✅Bot sudah aktif kembali')
  }

  return m.reply('Gunakan perintah:\n*.mute on* untuk mute bot\n*.mute off* untuk unmute bot')
}

handler.help = ['mute <on/off>']
handler.tags = ['group']
handler.command = /^(mute|diam)$/i

handler.group = true
handler.admin = true

export default handler