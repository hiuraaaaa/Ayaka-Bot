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

    let res
    try {
      let response = await axios.get('https://api.termai.cc/api/text2speech/elevenlabs', {
        params: {
          text: text,
          key: global.api.xterm.key,
          voice: 'megawati'
        },
        responseType: 'arraybuffer' // Mengatur tipe respons sebagai arraybuffer untuk menerima data audio
      })
      res = response.data
      conn.sendFile(m.chat, res, 'tts.opus', null, m, true)

      // Reaksi setelah pemrosesan berhasil
      await conn.sendMessage(m.chat, { react: { text: `✅`, key: m.key } });

    } catch (e) {
      // Reaksi ketika terjadi kesalahan
      await conn.sendMessage(m.chat, { react: { text: `❌`, key: m.key } });
      m.reply(e + '')
    }
  } catch (error) {
    console.log(error)
    m.reply("Masukkan Text")
  }
}

handler.help = ['megawati <teks>']
handler.tags = ['premium']
handler.command = /^megawati$/i
handler.premium = true

export default handler