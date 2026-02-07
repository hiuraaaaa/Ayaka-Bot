import uploadImage from '../lib/memek.js'
import fetch from 'node-fetch'
import { tmpdir } from 'os'
import { writeFile } from 'fs/promises'
import path from 'path'

let handler = async (m, { conn }) => {
  let q = m.quoted ? m.quoted : m
  let mime = (q.msg || q).mimetype || ''
  if (!mime) throw 'No media found'

  conn.sendMessage(m.chat, {
    react: {
      text: '🎀',
      key: m.key,
    }
  })

  let media = await q.download()
  if (!/image\/(png|jpe?g|gif)|video\/mp4/.test(mime)) throw 'Format tidak didukung. Gunakan gambar atau video mp4.'

  let link = await uploadImage(media)
  let s = await filters(link)
  if (!s || !s.url) throw 'Gagal memproses gambar.'

  // Fetch hasil gambar
  let buff = await fetch(s.url).then(res => res.buffer())
  await conn.sendMessage(m.chat, {
    image: buff,
    caption: 'Berhasil diubah dengan model Realistic!'
  }, { quoted: m })
}

handler.help = ['toreall (reply media)']
handler.tags = ['ai','premium']
handler.command = /^(toreall)$/i
handler.premium = true
export default handler

async function filters(imageurl, model = "anime2real") {
  try {
    const ai = await fetch(`${api.xterm.url}/api/img2img/filters?action=${model}&url=${imageurl}&key=${api.xterm.key}`)
      .then(res => res.json())

    if (!ai.status || !ai.id) throw 'Gagal memulai proses filter.'

    let tryng = 0
    while (tryng < 50) {
      tryng++
      const s = await fetch(`${api.xterm.url}/api/img2img/filters/batchProgress?id=${ai.id}`)
        .then(res => res.json())

      if (s.status === 3 && s.url) return s
      if (s.status === 4) throw 'Terjadi kesalahan saat memproses. Gunakan gambar lain.'

      await new Promise(res => setTimeout(res, 2000))
    }

    throw 'Waktu tunggu habis. Coba lagi nanti.'
  } catch (e) {
    throw typeof e === 'string' ? e : 'Gagal memproses gambar.'
  }
}