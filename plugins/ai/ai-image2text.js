import fetch from 'node-fetch'
import FormData from 'form-data'
import { writeFileSync, unlinkSync } from 'fs'
import { tmpdir } from 'os'
import path from 'path'

let handler = async (m, { conn, args, usedPrefix, command }) => {
  let q = m.quoted ? m.quoted : m
  let mime = (q.msg || q).mimetype || ''
  
  let url = args[0]
  
  if (!url && !mime.includes('image')) throw `Kirim atau reply gambar dengan caption *${usedPrefix + command}* atau sertakan link gambar.\n\nContoh: *${usedPrefix + command} https://cataas.com/cat*`

  try {
    m.reply('⏳ Sedang memproses...')

    if (!url) {
      // Download dan upload gambar ke Catbox
      let buffer = await q.download()
      let fileName = path.join(tmpdir(), `${Date.now()}.jpg`)
      writeFileSync(fileName, buffer)

      const form = new FormData()
      form.append('reqtype', 'fileupload')
      form.append('fileToUpload', buffer, 'image.jpg')

      let uploadRes = await fetch('https://catbox.moe/user/api.php', {
        method: 'POST',
        body: form
      })

      url = await uploadRes.text()
      unlinkSync(fileName)
    }

    let api = `https://api.siputzx.my.id/api/ai/image2text?url=${encodeURIComponent(url)}`
    let res = await fetch(api)
    let json = await res.json()

    if (json.status && json.data) {
      m.reply(`*Deskripsi Gambar:*\n${json.data}`)
    } else {
      m.reply('Gagal mengambil deskripsi gambar.')
    }
  } catch (e) {
    console.error(e)
    m.reply(`Terjadi kesalahan:\n${e.message}`)
  }
}

handler.command = handler.help = ['image2text']
handler.tags = ['ai']
handler.premium = false
handler.limit = true
handler.register = true

export default handler