import fetch from 'node-fetch'

let handler = async (m, { conn, text }) => {
  if (!text) throw 'Masukkan kata kunci pencarian!\nContoh: .bingvideo kucing'

  // React saat mulai proses
  await conn.sendMessage(m.chat, { react: { text: "🍊", key: m.key } })

  try {
    let api = `https://api.alvianuxio.eu.org/api/bing/video?search=${encodeURIComponent(text)}&apikey=au-basicX2s`
    let res = await fetch(api)
    if (!res.ok) throw 'Gagal mengambil data!'
    let json = await res.json()

    if (!json.data || !json.data.response) throw 'Tidak ada hasil ditemukan!'

    let teks = `*Hasil Pencarian Video Bing untuk:* ${text}\n\n`
    let hasil = json.data.response.filter(v => v.link && !v.link.includes('undefined'))
    
    if (hasil.length === 0) throw 'Tidak ada video valid yang ditemukan!'

    for (let vid of hasil) {
      teks += `• *Channel:* ${vid.channel || '-'}\n`
      teks += `• *Durasi:* ${vid.duration || '-'}\n`
      teks += `• *Views:* ${vid.views || '-'}\n`
      teks += `• *Upload:* ${vid.uploadDate || '-'}\n`
      teks += `• *Link:* ${vid.link}\n\n`
    }

    // React saat selesai
    await conn.sendMessage(m.chat, { react: { text: "🍏", key: m.key } })

    await m.reply(teks.trim())
  } catch (e) {
    console.error(e)
    await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } })
    m.reply('Terjadi kesalahan saat mencari video.')
  }
}

handler.help = ['bingvideo <kata kunci>']
handler.tags = ['internet']
handler.command = /^bingvideo$/i

export default handler