import uploadImage from '../lib/uploadImage.js'
import axios from 'axios'

const handler = async (m, { conn }) => {
  await conn.sendMessage(m.chat, { react: { text: '✨', key: m.key } })

  const quoted = m.quoted ? m.quoted : m
  if (!quoted.mimetype && !quoted.msg?.mimetype) throw '❌ Kirim atau reply gambar untuk diproses.'

  try {
    const media = await quoted.download()
    const imageUrl = await uploadImage(media)
    if (!imageUrl) throw '❌ Upload gambar gagal.'

    const { data } = await axios.get('https://fastrestapis.fasturl.cloud/aiimage/upscale', {
      params: {
        resize: 2,
        imageUrl,
      },
      responseType: 'arraybuffer',
      headers: {
        Accept: 'application/json',
        'content-type': 'application/json',
      },
    })

    const size = formatSize(data.length)
    const caption = `✨ *Photo Remini*\n📁 Size: ${size}`

    await conn.sendMessage(m.chat, {
      image: data,
      caption
    }, { quoted: m })

  } catch (err) {
    console.error(err)
    m.reply('❌ Terjadi kesalahan saat memproses gambar.')
  }
}

handler.help = ['upscaler', 'remini']
handler.tags = ['ai']
handler.command = ['upscaler', 'remini']

export default handler

function formatSize(size) {
  const round = (v, p = 1) => Math.round(v * 10 ** p) / 10 ** p
  const KB = 1024, MB = KB ** 2, GB = KB ** 3, TB = KB ** 4
  if (size < KB) return size + 'B'
  if (size < MB) return round(size / KB) + 'KB'
  if (size < GB) return round(size / MB) + 'MB'
  if (size < TB) return round(size / GB) + 'GB'
  return round(size / TB) + 'TB'
}