import fetch from 'node-fetch'
import axios from 'axios'

let handler = async (m, { conn }) => {
  const q = m.quoted ? m.quoted : m
  const mime = (q.msg || q).mimetype || ''

  if (!mime || !/image\/(jpe?g|png)/.test(mime)) {
    return m.reply('❌ Kirim atau balas gambar dengan caption *.inkstains*')
  }

  try {
    await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })

    const imgBuffer = await q.download()
    if (!imgBuffer) return m.reply('❌ Gagal mengunduh gambar.')

    const FormData = (await import('form-data')).default
    const form = new FormData()
    form.append('file', imgBuffer, 'image.jpg')

    const uploadRes = await axios.post('https://fastrestapis.fasturl.cloud/downup/uploader-v1', form, {
      headers: form.getHeaders()
    })

    const imageUrl = uploadRes.data?.result
    if (!imageUrl || !imageUrl.includes('fasturl')) throw 'Gagal upload ke FastURL.'

    const apiUrl = `https://api.ubed.my.id/imgedit/ink-stains?apikey=ubed2407&imageUrl=${encodeURIComponent(imageUrl)}`
    const res = await fetch(apiUrl)
    if (!res.ok) throw 'API gagal merespons.'

    const buffer = await res.buffer()
    await conn.sendMessage(m.chat, {
      image: buffer,
      caption: '✅ *Gambar berhasil diedit dengan efek Ink Stains!*',
    }, { quoted: m })

    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })

  } catch (e) {
    console.error('INK STAINS API Error:', e)
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
    m.reply('❌ Terjadi kesalahan saat memproses gambar.')
  }
}

handler.help = ['inkstains']
handler.tags = ['ai', 'tools']
handler.command = /^inkstains$/i
handler.limit = true

export default handler