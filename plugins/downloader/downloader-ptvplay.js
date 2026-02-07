import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`❌ Masukkan judul lagu atau video.\n\nContoh:\n${usedPrefix + command} Souqy - Aku Sayang Banget Sama Kamu`)

  // 🍏 React emoji saat mulai
  await conn.sendMessage(m.chat, {
    react: {
      text: '🍏',
      key: m.key
    }
  })

  // Ambil API dari global config
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
      video: { url: download_url },
      gifPlayback: true,     // ✅ Trik paksa mode PTV
      ptv: true,             // ✅ Mode PTV aktif
      mimetype: mimetype || 'video/mp4',
      fileName: `${title}.mp4`,
      caption: `📹 *${title}*\n💾 Ukuran: ${size || 'Tidak diketahui'}`
    }, { quoted: m })

  } catch (err) {
    console.error(err)
    m.reply(`❌ Terjadi kesalahan:\n${err.message}`)
  }
}

handler.help = ['ptvplay <judul>']
handler.tags = ['downloader']
handler.command = ['ptvplay']
handler.limit = true

export default handler