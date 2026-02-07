import axios from 'axios'

let handler = async (m, { conn, args }) => {
  try {
    let text = args.join(' ')
    if (!text && m.quoted && m.quoted.text) text = m.quoted.text
    if (!text) return m.reply("Masukkan kata yang ingin diubah menjadi suara 🎙️")

    // Kirim reaksi saat mulai proses
    await conn.sendMessage(m.chat, { react: { text: '⏱️', key: m.key } })

    try {
      const response = await axios.get(`${global.api.xterm.url}/api/text2speech/elevenlabs`, {
        params: {
          text,
          key: global.api.xterm.key,
          voice: 'prabowo' // default voice
        },
        responseType: 'arraybuffer'
      })

      const res = response.data
      await conn.sendFile(m.chat, res, 'tts.opus', null, m, true)

      // Reaksi sukses ✅
      await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })

    } catch (e) {
      // Reaksi gagal ❌
      await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
      m.reply(`Terjadi kesalahan: ${e.message || e}`)
    }

  } catch (error) {
    console.error(error)
    m.reply("Masukkan teks yang valid.")
  }
}

handler.help = ['prabowo <teks>']
handler.tags = ['premium']
handler.command = /^prabowo$/i
handler.premium = true

export default handler