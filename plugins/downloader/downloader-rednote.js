import axios from 'axios'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`Masukkan link XHS!\n\nContoh:\n${usedPrefix}${command} https://xhslink.com/a/OAzIdalFCoYcb`)

  await conn.sendMessage(m.chat, {
    react: {
      text: '⏳',
      key: m.key
    }
  })

  try {
    const res = await axios.post('https://xhs.ratbox.top/api/download', {
      traceId: Math.random().toString(36).slice(2),
      xhsLink: text
    }, {
      headers: {
        'content-type': 'text/plain;charset=UTF-8',
        'origin': 'https://xhs.ratbox.top',
        'referer': 'https://xhs.ratbox.top/en/dashboard',
        'user-agent': 'Mozilla/5.0'
      }
    })

    const { title, content, imageUrlList, videoUrlList } = res.data?.data?.data || {}

    const video = (videoUrlList || []).find(v => v.endsWith('.mp4')) || null
    const images = !video && imageUrlList ? imageUrlList.map(i => i.removeWatermarkUrl || i.originalUrl) : []

    const caption = `✨ *Title:* *${title || 'Tanpa Judul'}*\n\n📝 *Caption:* ${content || 'Tidak ada deskripsi'}\n\n🔗 Source: ${text}`

    if (video) {
      await conn.sendMessage(m.chat, {
        video: { url: video },
        caption
      }, { quoted: m })
    } else if (images.length) {
      for (let i = 0; i < images.length; i++) {
        await conn.sendMessage(m.chat, {
          image: { url: images[i] },
          caption: i === 0 ? caption : ''
        }, { quoted: m })
      }
    } else {
      await m.reply('❌ Tidak ada media yang bisa diunduh.')
    }

    await conn.sendMessage(m.chat, {
      react: {
        text: '✅',
        key: m.key
      }
    })

  } catch (e) {
    await conn.sendMessage(m.chat, {
      react: {
        text: '❌',
        key: m.key
      }
    })
    m.reply(`❌ Gagal mengambil data:\n${e.message}`)
  }
}

handler.help = ['xiaohongshu', 'rednote'];
handler.command = /^(xiaohongshu|xhs|xhsdl|rednote)$/i;
handler.tags = ['downloader'];
handler.limit = true;
handler.premium = false;

export default handler;;