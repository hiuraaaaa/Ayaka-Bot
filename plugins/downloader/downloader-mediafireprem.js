import fetch from 'node-fetch'
import util from 'util'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  const apikey = 'ubed2407'
  if (!text) {
    return m.reply(`❌ *Link kosong!*\n\nContoh:\n${usedPrefix + command} https://www.mediafire.com/file/xxxxx/namafile.zip/file`)
  }

  m.reply('⏳ *Mengambil data dari Mediafire...*')

  try {
    const res = await fetch(`https://api.ubed.my.id/download/mediafire?apikey=${apikey}&url=${encodeURIComponent(text)}`)
    const json = await res.json()

    if (json.status !== 200 || !json.result || !json.result.download) {
      return m.reply('⚠️ Gagal mengambil data dari API. Periksa kembali link atau coba lagi nanti.')
    }

    const {
      filename,
      size,
      filetype,
      mimetype,
      download,
      created
    } = json.result

    const info = `📦 *MEDIAFIRE PREM DOWNLOADER*

📄 *Nama:* ${filename}
📁 *Tipe:* ${filetype}
⚖️ *Ukuran:* ${size}
📅 *Upload:* ${created}
🔗 *Link:* ${download}
`

    await m.reply(info)

    
    const sizeInMB = parseFloat(size.replace(/[^0-9.]/g, ''))
    if (sizeInMB >= 150) {
      return m.reply('⚠️ File terlalu besar untuk dikirim melalui WhatsApp.\nSilakan unduh manual:\n' + download)
    }

    await conn.sendFile(
      m.chat,
      download,
      filename,
      '',
      m,
      null,
      {
        mimetype: mimetype || 'application/octet-stream',
        asDocument: true
      }
    )
  } catch (err) {
    console.error(err)
    m.reply('❌ Terjadi kesalahan saat memproses permintaan kamu.')
  }
}

handler.help = ['mediafireubed <link>']
handler.tags = ['downloader']
handler.command = /^(mediafireprem|mfprem)$/i
handler.register = true
handler.limit = false
handler.premium = true

export default handler