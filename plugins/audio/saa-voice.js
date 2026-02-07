import axios from 'axios'

let handler = async (m, { conn, args }) => {
  try {
    let text = args.join(' ')
    if (!text && m.quoted && m.quoted.text) text = m.quoted.text
    if (!text) {
      m.reply("Masukkan kata")
      return
    }

    // Reaksi saat memulai pemrosesan
    await conn.sendMessage(m.chat, { react: { text: `⏱️`, key: m.key } });

    try {
      const response = await axios.get(`${global.api.xterm.url}/api/text2speech/elevenlabs`, {
        params: {
          text: text,
          key: global.api.xterm.key,
          voice: 'bella' // voice tetap di sini (tidak di config)
        },
        responseType: 'arraybuffer'
      })

      const res = response.data
      await conn.sendFile(m.chat, res, 'tts.opus', null, m, true)

      // Reaksi setelah berhasil
      await conn.sendMessage(m.chat, { react: { text: `✅`, key: m.key } });

    } catch (e) {
      // Reaksi ketika error
      await conn.sendMessage(m.chat, { react: { text: `❌`, key: m.key } });
      console.error(e)
      m.reply('❌ Terjadi kesalahan saat membuat suara.')
    }

  } catch (error) {
    console.error(error)
    m.reply("Masukkan teks yang ingin diubah jadi suara.")
  }
}

handler.help = ['Lann4youvn <teks>']
handler.tags = ['premium']
handler.command = /^Lann4youvn$/i
handler.premium = true

export default handler