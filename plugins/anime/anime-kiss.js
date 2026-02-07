import axios from 'axios'

let handler = async (m, { conn }) => {
  // Kirim reaksi 🍏 saat memproses
  await conn.sendMessage(m.chat, {
    react: {
      text: '🍏',
      key: m.key
    }
  })

  try {
    const waifudd = await axios.get(`https://nekos.life/api/v2/img/kiss`)
    await conn.sendMessage(m.chat, {
      image: { url: waifudd.data.url },
      caption: '💋 Anime Kiss!',
    }, { quoted: m })
  } catch (err) {
    await conn.sendMessage(m.chat, {
      text: '⚠️ Gagal mengambil gambar anime kiss!',
    }, { quoted: m })
  }
}

handler.help = ['animekiss']
handler.tags = ['anime']
handler.command = /^animekiss$/i

export default handler