let handler = async (m, { text, command, conn }) => {
  if (!text) throw `Contoh: .${command} Aku sayang kamu`

  let name = ''
  let kelas = ''

  if (text.includes('|')) {
    const parts = text.split('|')
    text = parts[2] || parts[0]
    name = parts[0]?.trim()
    kelas = parts[1]?.trim()
  }

  m.reply('Menulis di buku...')

  let url = `https://api.siputzx.my.id/api/m/nulis?text=${encodeURIComponent(text)}&name=${encodeURIComponent(name)}&class=${encodeURIComponent(kelas)}`

  await conn.sendMessage(m.chat, {
    image: { url },
    caption: `Berikut hasil tulisan tanganmu.`
  }, { quoted: m })
}

handler.command = ['nulis']
handler.help = ['nulis <teks>']
handler.tags = ['tools']
handler.register = true

export default handler