import axios from 'axios'

let handler = async (m, { conn }) => {
  // React emoji 🍏 saat mulai proses
  await conn.sendMessage(m.chat, {
    react: {
      text: '🍏',
      key: m.key
    }
  })

  try {
    const { data } = await axios.get('https://nekos.life/api/v2/fact')
    // Ganti replyviex dengan cara reply yang ada di botmu
    await conn.sendMessage(m.chat, { text: `🤖 *Fact:* ${data.fact}` }, { quoted: m })
  } catch (e) {
    await conn.sendMessage(m.chat, { text: '⚠️ Gagal mengambil fact' }, { quoted: m })
  }
}

handler.help = ['fact']
handler.tags = ['fun']
handler.command = /^fact$/i

export default handler