import axios from 'axios'
import FormData from 'form-data'
import crypto from 'crypto'
import { fileTypeFromBuffer } from 'file-type'

let g = () => `${crypto.randomBytes(8).toString('hex')}_aiimglarger`

let u = async (b, n = 'temp.jpg', s = 4, t = 0) => {
  try {
    let x = g()
    let f = new FormData()
    f.append('type', t)
    f.append('username', x)
    f.append('scaleRadio', s.toString())
    f.append('file', b, { filename: n, contentType: 'image/jpeg' })
    let r = await axios.post('https://photoai.imglarger.com/api/PhoAi/Upload', f, {
      headers: {
        ...f.getHeaders(),
        'User-Agent': 'Dart/3.5 (dart:io)',
        'Accept-Encoding': 'gzip',
      },
    })
    let { code: c } = r.data.data
    let p = { code: c, type: t, username: x, scaleRadio: s.toString() }
    let d
    for (let i = 0; i < 1000; i++) {
      let q = await axios.post('https://photoai.imglarger.com/api/PhoAi/CheckStatus', JSON.stringify(p), {
        headers: {
          'User-Agent': 'Dart/3.5 (dart:io)',
          'Accept-Encoding': 'gzip',
          'Content-Type': 'application/json',
        },
      })
      d = q.data.data
      if (d.status === 'success') break
      await new Promise(r => setTimeout(r, 500))
    }
    if (d.status === 'success') return d.downloadUrls[0]
    else throw new Error('Upscale gagal setelah polling maksimal.')
  } catch (e) {
    return e
  }
}

let handler = async (m, { conn, usedPrefix, command }) => {
  let q = m.quoted ? m.quoted : m
  let mime = (q.msg || q).mimetype || ''
  if (!/image\/(png|jpe?g)/i.test(mime)) {
    return conn.reply(m.chat, `Eits, Senpai! Kirim atau balas *gambar* (PNG/JPG) pake caption *${usedPrefix + command}*, ya!`, m)
  }
  await conn.sendMessage(m.chat, { react: { text: '🪄', key: m.key } })
  try {
    let media = await q.download()
    if (!media) throw new Error('Gagal download gambar, apa gambarnya malu-malu? 😅')
    let buffer = Buffer.from(media)
    let { ext } = await fileTypeFromBuffer(buffer) || {}
    let hdUrl = await u(buffer, 'temp.' + ext, 4, 0)
    if (!hdUrl || hdUrl instanceof Error) throw new Error('Gagal proses HD upscale!')
    await conn.sendFile(m.chat, hdUrl, 'upscaled_image.' + ext, 'Tadaa! Gambar Senpai udah jadi HD! ✨', m)
    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
  } catch (e) {
    let detail = e.message || e.toString()
    let errorMsg = `Aduh, Senpai! Gagal di-upscale nih. Detail error:\n${detail}\nCoba lagi ya!`
    if (detail.includes('download')) {
      errorMsg = `Gambarnya kabur entah kemana, gagal download! 😵\nDetail error:\n${detail}\nCoba kirim ulang, Senpai!`
    }
    await conn.reply(m.chat, errorMsg, m)
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
  }
}

handler.help = ['hd', 'hdr']
handler.tags = ['ai']
handler.command = /^(hd2|hdr2)$/i
handler.register = true
handler.limit = 3

export default handler