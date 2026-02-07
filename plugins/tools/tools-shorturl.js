import axios from 'axios'

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) {
    return m.reply(`🚫 Contoh penggunaan:\n\n${usedPrefix + command} https://Lann4youofc.my.id [custom]`)
  }

  const originalUrl = args[0]
  const customCode = args[1] || Math.floor(100000 + Math.random() * 900000).toString()
  const timestamp = Math.floor(Date.now() / 1000)

  await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })

  try {
    const payload = {
      url: originalUrl,
      custom: customCode,
      timestamp
    }

    const headers = {
      'Content-Type': 'application/json',
      'Origin': 'https://cloudku.click',
      'Referer': 'https://cloudku.click/',
      'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107 Safari/537.36',
      'X-Requested-With': 'XMLHttpRequest'
    }

    const { data } = await axios.post('https://cloudku.click/api/link.php', payload, { headers })

    if (!data.success) throw new Error('Gagal membuat shortlink: ' + JSON.stringify(data))

    let caption = `✅ *Short URL berhasil dibuat!*\n\n`
    caption += `🔗 *Original:* ${data.data.originalUrl}\n`
    caption += `🌐 *Short URL:* ${data.data.shortUrl}\n`
    caption += `🆔 *Key:* ${data.data.key}\n`
    caption += `📅 *Created:* ${data.data.created}`

    await conn.sendMessage(m.chat, {
      text: caption
    }, { quoted: m })

  } catch (err) {
    await conn.sendMessage(m.chat, {
      text: `❌ Gagal membuat shortlink:\n${err.message}`
    }, { quoted: m })
  }
}

handler.help = ['shorturl'].map(v => v + ' <url> [custom]')
handler.tags = ['tools']
handler.command = /^(shorturl)$/i
handler.limit = 3

export default handler