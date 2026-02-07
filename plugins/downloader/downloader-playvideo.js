import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`❌ Masukkan judul lagu atau video.\n\nContoh:\n${usedPrefix + command} Souqy asbsk`)

  // Emoji reaksi 🍏 saat mulai proses
  if (conn.sendMessage) {
    await conn.sendMessage(m.chat, {
      react: {
        text: '🍏',
        key: m.key
      }
    })
  }

  // Ambil dari global config
  const apiDomain = global.ubedAPI?.domain
  const apiKey = global.ubedAPI?.key

  if (!apiDomain || !apiKey) return m.reply('❌ API belum dikonfigurasi di global.ubedAPI')

  const endpoint = `${apiDomain}/downloder/Youtube-play?apikey=${apiKey}&q=${encodeURIComponent(text)}`

  try {
    const res = await fetch(endpoint)
    if (!res.ok) throw new Error(`Gagal akses API: ${res.statusText}`)

    const data = await res.json()

    if (!data.status || !data.result?.download_url) {
      throw new Error('❌ Video tidak ditemukan atau gagal diproses.')
    }

    const { title, video_url, download_url, size, mimetype } = data.result

    await conn.sendMessage(m.chat, {
      caption: `📹 *${title}*\n🔗 ${video_url}\n💾 Ukuran: ${size || 'Tidak diketahui'}`,
      video: { url: download_url },
      mimetype: mimetype || 'video/mp4'
    }, { quoted: m })

  } catch (err) {
    console.error(err)
    m.reply(`❌ Terjadi kesalahan:\n${err.message}`)
  }
}

handler.help = ['playvideo <judul/video>']
handler.tags = ['downloader']
handler.command = ['playvid', 'playvideo']
handler.limit = true

export default handler