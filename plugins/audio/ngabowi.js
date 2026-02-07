import axios from 'axios'

let handler = async (m, { conn, args }) => {
  try {
    // Ambil teks dari args atau reply
    let text = args.join(' ')
    if (!text && m.quoted && m.quoted.text) text = m.quoted.text
    if (!text) return m.reply("Masukkan teks yang ingin diubah menjadi suara.")

    // Reaksi saat mulai proses
    await conn.sendMessage(m.chat, { react: { text: `⏱️`, key: m.key } })

    // Proses TTS
    const response = await axios.get(`${global.api.xterm.url}/api/text2speech/elevenlabs`, {
      params: {
        text: text,
        key: global.api.xterm.key,
        voice: 'jokowi' // tetap di sini, tidak di config
      },
      responseType: 'arraybuffer'
    })

    const audioBuffer = response.data

    // Kirim hasil
    await conn.sendFile(m.chat, audioBuffer, 'tts.opus', null, m, true)

    // Reaksi sukses
    await conn.sendMessage(m.chat, { react: { text: `✅`, key: m.key } })

  } catch (err) {
    // Reaksi error
    await conn.sendMessage(m.chat, { react: { text: `❌`, key: m.key } })
    console.error(err)
    m.reply('❌ Terjadi kesalahan saat membuat suara.')
  }
}

handler.help = ['ngabowi <teks>']
handler.tags = ['premium']
handler.command = /^ngabowi$/i
handler.premium = true

export default handler