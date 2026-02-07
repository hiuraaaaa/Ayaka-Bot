import axios from 'axios'
import FormData from 'form-data'
import uploadImage from '../lib/uploadImage.js'

async function Image2Comic(imageUrl) {
  const imageRes = await axios.get(imageUrl, { responseType: 'arraybuffer' })
  const imageBuffer = Buffer.from(imageRes.data)

  const form = new FormData()
  form.append('hidden_image_width', '1712')
  form.append('hidden_image_height', '2560')
  form.append('upload_file', imageBuffer, {
    filename: 'image.jpg',
    contentType: 'image/jpeg'
  })
  form.append('brightness', '50')
  form.append('line_size', '2')
  form.append('screentone', 'true')

  const id = Math.random().toString(36).substring(2, 15)
  const uploadUrl = `https://tech-lagoon.com/canvas/image-to-comic?id=${id}&new_file=true`

  const uploadRes = await axios.post(uploadUrl, form, {
    headers: {
      ...form.getHeaders(),
      'origin': 'https://tech-lagoon.com',
      'referer': 'https://tech-lagoon.com/imagechef/en/image-to-comic.html',
      'x-requested-with': 'XMLHttpRequest',
      'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
    },
  })

  if (!Array.isArray(uploadRes.data)) throw new Error('Gagal mendapatkan hasil dari server~')

  const [resId] = uploadRes.data
  const n = Math.floor(Math.random() * 9000 + 1000)

  return {
    hasil: `https://tech-lagoon.com/imagechef/image-to-comic/${resId}?n=${n}`
  }
}

let handler = async (m, { conn, command }) => {
  const q = m.quoted || m
  const mime = (q.msg || q).mimetype || ''

  if (!mime.startsWith('image/')) {
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
    throw `📷 Kirim atau balas gambar dulu, senpai!\nContoh:\n\n*.${command}*`
  }

  await conn.sendMessage(m.chat, { react: { text: '🎨', key: m.key } })

  let buffer
  try {
    buffer = await q.download()
  } catch {
    await conn.sendMessage(m.chat, { react: { text: '⚠️', key: m.key } })
    return m.reply('😿 Gagal mengunduh gambar-nya, coba lagi ya~')
  }

  let imageUrl
  try {
    imageUrl = await uploadImage(buffer)
  } catch {
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
    return m.reply('Gagal upload gambar ke awan~ ☁️')
  }

  await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })

  try {
    const result = await Image2Comic(imageUrl)

    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })

    await conn.sendMessage(m.chat, {
      image: { url: result.hasil },
      caption: `✨ *Komik siap, sensei!*\n
📖 Cek hasil transformasi ala manga di atas. Kalau gak muncul, coba kedipin mata dua kali dulu 😆`
    }, { quoted: m })

  } catch (e) {
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
    m.reply('💔 Gagal mengubah ke gaya komik:\n' + e.message)
  }
}

handler.help = ['tokomik']
handler.tags = ['ai', 'tools']
handler.command = /^(tocomic|tokomik)$/i
handler.limit = true

export default handler