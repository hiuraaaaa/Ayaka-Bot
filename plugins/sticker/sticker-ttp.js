import fetch from 'node-fetch'
import { Sticker } from 'wa-sticker-formatter'

const handler = async (m, { conn, text, command }) => {
  if (!text) throw `Kirim perintah dengan teks!\nContoh: .${command} halo`

  const react = { react: { text: '✨', key: m.key } }
  await conn.sendMessage(m.chat, react)

  try {
    const res = await fetch(`https://api.nekorinn.my.id/maker/ttp?text=${encodeURIComponent(text)}`)
    if (!res.ok) throw 'Gagal mengambil data dari API'

    const buffer = await res.buffer()

    const sticker = new Sticker(buffer, {
      pack: global.namebot,
      author: global.author,
      type: 'full',
      categories: ['✨'],
      quality: 80
    })

    const stickerBuffer = await sticker.toBuffer()

    await conn.sendMessage(m.chat, { sticker: stickerBuffer }, { quoted: m })
  } catch (err) {
    console.error(err)
    m.reply('Terjadi kesalahan saat membuat stiker.')
  } finally {
    await conn.sendMessage(m.chat, { react: { text: '', key: m.key } })
  }
}

handler.help = ['ttp <teks>']
handler.tags = ['sticker']
handler.command = /^ttp$/i
handler.register = true

export default handler