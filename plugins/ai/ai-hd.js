import axios from 'axios'
import FormData from 'form-data'
import crypto from 'crypto'
import { fileTypeFromBuffer } from 'file-type'

let generateUser = () => `${crypto.randomBytes(8).toString('hex')}_aiimglarger`

let upscaleImage = async (buffer, filename = 'image.jpg', scale = 4, type = 0) => {
  try {
    let username = generateUser()
    let form = new FormData()
    form.append('type', type)
    form.append('username', username)
    form.append('scaleRadio', scale.toString())
    form.append('file', buffer, { filename, contentType: 'image/jpeg' })

    let uploadRes = await axios.post('https://photoai.imglarger.com/api/PhoAi/Upload', form, {
      headers: {
        ...form.getHeaders(),
        'User-Agent': 'Dart/3.5 (dart:io)',
        'Accept-Encoding': 'gzip',
      },
    })

    let { code } = uploadRes.data.data
    let payload = { code, type, username, scaleRadio: scale.toString() }

    let statusData
    for (let i = 0; i < 1000; i++) {
      let checkRes = await axios.post('https://photoai.imglarger.com/api/PhoAi/CheckStatus', JSON.stringify(payload), {
        headers: {
          'User-Agent': 'Dart/3.5 (dart:io)',
          'Accept-Encoding': 'gzip',
          'Content-Type': 'application/json',
        },
      })
      statusData = checkRes.data.data
      if (statusData.status === 'success') break
      await new Promise(resolve => setTimeout(resolve, 500))
    }

    if (statusData.status === 'success') return statusData.downloadUrls[0]
    else throw new Error('Proses upscale gagal setelah percobaan maksimal.')
  } catch (err) {
    return err
  }
}

let handler = async (m, { conn, usedPrefix, command }) => {
  let quoted = m.quoted ? m.quoted : m
  let mime = (quoted.msg || quoted).mimetype || ''

  if (!/image\/(png|jpe?g)/i.test(mime)) {
    return conn.reply(
      m.chat,
      `⚠️ Sistem deteksi: Format tidak valid.  
Silakan kirim atau balas *gambar* (PNG/JPG) dengan caption *${usedPrefix + command}*.`,
      m
    )
  }

  await conn.sendMessage(m.chat, { react: { text: '⚙️', key: m.key } })

  try {
    let media = await quoted.download()
    if (!media) throw new Error('Gagal mengunduh file. Silakan coba ulangi pengiriman.')

    let buffer = Buffer.from(media)
    let { ext } = await fileTypeFromBuffer(buffer) || { ext: 'jpg' }

    let hdUrl = await upscaleImage(buffer, 'upscale.' + ext, 4, 0)
    if (!hdUrl || hdUrl instanceof Error) throw new Error('Proses upscale tidak berhasil dijalankan.')

    await conn.sendFile(
      m.chat,
      hdUrl,
      'upscaled_image.' + ext,
      `✅ Proses berhasil.  
Gambar telah di-upscale ke resolusi lebih tinggi.`,
      m
    )
    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
  } catch (err) {
    let detail = err.message || err.toString()
    let errorMsg = `❌ Upscale gagal diproses.  
Detail: ${detail}`

    if (detail.includes('download')) {
      errorMsg = `❌ Kesalahan: File tidak dapat diunduh.  
Detail: ${detail}`
    }

    await conn.reply(m.chat, errorMsg, m)
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
  }
}

handler.command = ['hdr','hd']
handler.tags = ['ai', 'tools']
handler.help = ['hd']
handler.register = true

export default handler