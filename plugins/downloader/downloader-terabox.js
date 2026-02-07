import axios from 'axios'

const terabox = async (link) => {
  try {
    if (!/^https:\/\/(1024)?terabox\.com\/s\//.test(link)) {
      return { error: '⚠️ Link tidak valid desu~ Linknya harus dari *terabox.com* atau *1024terabox.com*~!' }
    }

    const res = await axios.post('https://teraboxdownloader.online/api.php', { url: link }, {
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://teraboxdownloader.online',
        'Referer': 'https://teraboxdownloader.online/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Accept': '*/*'
      }
    })

    const data = res.data
    if (!data?.direct_link) {
      return { error: '😿 Gomen~ Nggak nemu link download-nya...', debug: data }
    }

    return {
      file_name: data.file_name,
      size: data.size,
      size_bytes: data.sizebytes,
      direct_link: data.direct_link,
      thumb: data.thumb
    }

  } catch (err) {
    return { error: '💢 Waaah~ Error pas akses websitenya...', detail: err.message }
  }
}

const handler = async (m, { conn, text }) => {
  if (!text) return m.reply('💌 Kyaa~ Kirim link *Terabox*-nya dulu ya, senpai~!\n\nContoh:\n`.terabox https://terabox.com/s/xxxxxx`')

  await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })

  const result = await terabox(text)
  if (result.error) {
    return m.reply(`${result.error}${result.debug ? '\n\n🪄 *Debug Info:*\n```json\n' + JSON.stringify(result.debug, null, 2) + '\n```' : ''}`)
  }

  let buffer
  try {
    const res = await axios.get(result.direct_link, { responseType: 'arraybuffer' })
    buffer = res.data
  } catch {
    return m.reply('🥺 Gagal ngedownload file-nya, onegai coba lagi nanti~')
  }

  const ext = result.file_name.split('.').pop().toLowerCase()
  const isVideo = ['mp4', 'mkv', 'mov', 'webm'].includes(ext)
  const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)

  const caption = `🌸 *Terabox Downloader vWibu~*\n\n📁 *Nama File:* ${result.file_name}\n📦 *Ukuran:* ${result.size}\n\nUwU semoga bermanfaat ya, senpai!`

  if (isVideo) {
    await conn.sendMessage(m.chat, {
      video: buffer,
      fileName: result.file_name,
      caption
    }, { quoted: m })
  } else if (isImage) {
    await conn.sendMessage(m.chat, {
      image: buffer,
      fileName: result.file_name,
      caption
    }, { quoted: m })
  } else {
    await conn.sendMessage(m.chat, {
      document: buffer,
      fileName: result.file_name,
      mimetype: 'application/octet-stream',
      caption
    }, { quoted: m })
  }

  await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
}

handler.help = ['terabox'].map(v => v + ' <url>')
handler.tags = ['downloader']
handler.command = /^terabox$/i
handler.limit = true
handler.premium = false

export default handler