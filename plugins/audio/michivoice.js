import axios from 'axios'

let handler = async (m, { conn, args }) => {
  try {
    // Ambil teks dari argumen atau pesan yang direply
    let text = args.join(' ')
    if (!text && m.quoted && m.quoted.text) text = m.quoted.text
    if (!text) return m.reply("Masukkan teks yang ingin diubah menjadi suara.")

    // Kirim reaksi proses
    await conn.sendMessage(m.chat, { react: { text: `⏱️`, key: m.key } })

    try {
      // Panggil API TTS
      const response = await axios.get(`${global.api.xterm.url}/api/text2speech/elevenlabs`, {
        params: {
          text: text,
          key: global.api.xterm.key,
          voice: 'michi_jkt48' // voice tetap di sini
        },
        responseType: 'arraybuffer' // menerima data audio
      })

      const audioBuffer = response.data

      // Kirim hasil audio ke chat
      await conn.sendFile(m.chat, audioBuffer, 'tts.opus', null, m, true)

      // Reaksi sukses
      await conn.sendMessage(m.chat, { react: { text: `✅`, key: m.key } })

    } catch (e) {
      // Reaksi gagal
      await conn.sendMessage(m.chat, { react: { text: `❌`, key: m.key } })
      console.error('Error TTS:', e)
      m.reply('❌ Terjadi kesalahan saat membuat suara.')
    }

  } catch (error) {
    console.error(error)
    m.reply("Masukkan teks yang ingin diubah menjadi suara.")
  }
}

handler.help = ['michi <teks>']
handler.tags = ['premium']
handler.command = /^michi$/i
handler.premium = true

export default handler