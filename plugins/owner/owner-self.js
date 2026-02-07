let handler = async (m, { args, isROwner }) => {
  if (!isROwner) {
    global.dfail('rowner', m, conn)
    throw false
  }

  const type = (args[0] || '').toLowerCase()
  if (!['on', 'off'].includes(type)) {
    throw '⚠️ Gunakan:\n.self on\n.self off'
  }

  global.opts.self = type === 'on'

  await m.reply(`✅ Mode *Self* berhasil di- *${type === 'on' ? 'aktifkan (owner only)' : 'nonaktifkan (public mode)'}*!`)
}

handler.help = ['self [on/off]']
handler.tags = ['owner']
handler.command = /^self$/i
handler.rowner = true

export default handler