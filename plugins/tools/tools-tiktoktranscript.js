import axios from 'axios'

async function TtTranscript(videoUrl) {
  try {
    const res = await axios.post(
      'https://www.short.ai/self-api/v2/project/get-tiktok-youtube-link',
      {
        link: videoUrl
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Origin': 'https://www.short.ai',
          'Referer': 'https://www.short.ai/tiktok-script-generator',
          'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36'
        }
      }
    )

    const data = res.data?.data?.data
    if (!data) throw '❌ Data kosong atau tidak tersedia.'

    return {
      status: true,
      text: data.text,
      duration: data.duration,
      language: data.language,
      url: res.data?.data?.url, 
      segments: data.segments.map(s => ({
        start: s.start,
        end: s.end,
        text: s.text
      }))
    }

  } catch (err) {
    console.error('❌ Error:', err.response?.data || err.message)
    return { status: false, message: 'Gagal mengambil transcript.' }
  }
}

let handler = async (m, { text, args, usedPrefix, command, conn }) => {
  if (!text) return m.reply(`🚫 Contoh penggunaan:\n\n${usedPrefix + command} https://vt.tiktok.com/ZSSd8quKg/`)

  m.reply('⏳ Mengambil transcript dan video...')

  const result = await TtTranscript(text)
  if (!result.status || !result.url) return m.reply('❌ Gagal mengambil data. Pastikan link valid.')

  const caption = `
\`TikTok - Transcript\`

🕒 Durasi: ${result.duration}s
🗣️ Bahasa: ${result.language}

📝 *Transkrip:*
${result.text}
  `.trim()

  try {
    await conn.sendFile(m.chat, result.url, 'tiktok.mp4', caption, m)
  } catch (e) {
    console.error(e)
    m.reply('✅ Transkrip berhasil diambil, tapi gagal mengirim video.\n\n' + caption)
  }
}

handler.help = ['ttscript <link>']
handler.tags = ['tools','ai']
handler.command = ['ttscript','tttranscript']
handler.limit = true

export default handler