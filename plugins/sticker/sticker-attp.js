import fetch from 'node-fetch'
import { Sticker } from 'wa-sticker-formatter'

const handler = async (m, { conn, text, command }) => {
  if (!text) throw `Kirim perintah dengan teks!\nContoh: .${command} konichiwa`

  const react = { react: { text: '⏳', key: m.key } }
  await conn.sendMessage(m.chat, react)

  try {
    const apiUrl = `https://api.lolhuman.xyz/api/attp?apikey=de4youyt&text=${encodeURIComponent(text)}`
    const response = await fetch(apiUrl)
    if (!response.ok) throw 'Gagal mengambil data dari API'

    const stickerBuffer = await response.buffer()

    const sticker = new Sticker(stickerBuffer, {
      pack: global.namebot,
      author: global.author,
      type: 'full',
      animated: true,
      quality: 80
    })

    const buffer = await sticker.toBuffer()
    await conn.sendMessage(m.chat, { sticker: buffer }, { quoted: m })

  } catch (err) {
    console.error(err)
    m.reply('Gagal membuat stiker animasi.')
  } finally {
    await conn.sendMessage(m.chat, { react: { text: '', key: m.key } })
  }
}

handler.help = ['attp <teks>']
handler.tags = ['sticker']
handler.command = /^attp$/i
handler.register = true

export default handler