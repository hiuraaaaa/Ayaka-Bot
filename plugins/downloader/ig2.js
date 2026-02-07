let furina = async (m, { conn, text, usedPrefix, command }) => {
  const prefix = usedPrefix || '.'
  const cmd = command || 'ig'

  if (!text) {
    return conn.reply(
      m.chat,
      `📌 Masukkan URL Instagram!\nContoh: ${prefix + cmd} https://www.instagram.com/reel/xxxxxx/`,
      m,
      { quoted: m }
    )
  }

  if (m._igHandled) return
  m._igHandled = true

  try {
    const api = `https://rijalganzz.web.id/download/aio?url=${encodeURIComponent(text)}`
    const response = await fetch(api)

    if (!response.ok) {
      throw new Error(`Gagal mendownload informasi. ${response.status} ${response.statusText}`)
    }

    const json = await response.json()
    if (!json.status || !Array.isArray(json.data)) throw '❌ Data tidak ditemukan atau format tidak sesuai.'

    for (const post of json.data) {
      const title = post.title || '(tidak ada judul)'
      const thumb = post.videoimg_file_url || post.image || null
      const video = post.video_file_url || null
      const image = post.image || null

      if (video) {
        await conn.sendFile(
          m.chat,
          video,
          'ig.mp4',
          `📥 *Instagram Downloader*\n\n📝 *Judul:* ${title}`,
          m,
          false,
          {
            thumbnail: thumb ? { url: thumb } : null,
            quoted: m
          }
        )
      } else if (image) {
        await conn.sendFile(
          m.chat,
          image,
          'ig.jpg',
          `📥 *Instagram Downloader*\n\n📝 *Judul:* ${title}`,
          m,
          false,
          { quoted: m }
        )
      } else {
        throw '❌ Tidak ada media valid yang ditemukan.'
      }
    }

  } catch (e) {
    console.error('[IG API ERROR]', e)
    conn.reply(
      m.chat,
      '❌ Terjadi kesalahan saat mencoba mendownload media dari Instagram.',
      m,
      { quoted: m }
    )
  }
}

furina.help = ['ig2 <url>']
furina.tags = ['downloader']
furina.command = /^(ig2)$/i
furina.limit = false

export default furina