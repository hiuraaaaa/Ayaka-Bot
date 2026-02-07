import axios from 'axios'

const apiUrl = 'https://api-preview.chatgot.io/api/v1/deepimg/flux-1-dev'
const imageSize = '1024x1024'
const headers = {
  'Content-Type': 'application/json',
  'Origin': 'https://deepimg.ai',
  'Referer': 'https://deepimg.ai/'
}

function getDeviceId() {
  return `dev-${Math.floor(Math.random() * 1000000)}`
}

async function makeImage(prompt) {
  try {
    const response = await axios.post(apiUrl, {
      prompt,
      size: imageSize,
      device_id: getDeviceId()
    }, { headers })
    return response.data?.data?.images?.[0]?.url || null
  } catch (err) {
    console.error(err.response?.data || err.message)
    return null
  }
}

const handler = async (m, { conn, text }) => {
  if (!text) return m.reply('Eh Senpai, kasih prompt dong buat gambarnya!')

  await conn.sendMessage(m.chat, { react: { text: '🎨', key: m.key } })

  const medias = []
  for (let i = 0; i < 5; i++) {
    const imageUrl = await makeImage(text)
    if (imageUrl) {
      medias.push({ image: { url: imageUrl } })
    }
  }

  if (medias.length === 0) {
    await conn.sendMessage(m.chat, { react: { text: '', key: m.key } })
    return m.reply('Gagal bikin semua gambar nih, coba prompt lain ya Kak!')
  }

  try {
    await conn.sendAlbumMessage(m.chat, medias, { caption: `Nih Kak, 5 gambar dari prompt: "${text}"\nKeren-keren kan? 😎` })
    await conn.sendMessage(m.chat, { react: { text: '', key: m.key } })
  } catch (e) {
    await conn.sendMessage(m.chat, { react: { text: '', key: m.key } })
    await m.reply('Aduh, gagal kirim albumnya. Coba lagi yuk, Senpai!')
  }
}

handler.help = ['deepimg']
handler.command = /^(deepimg)$/i
handler.tags = ['ai']
handler.limit = true
handler.register = true

export default handler