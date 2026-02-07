import axios from 'axios'
import uploadImage from '../lib/uploadImage.js'

let handler = async (m, { conn, args, usedPrefix, command }) => {
  let imageUrl

  if (args[0] && args[0].startsWith('http')) {
    imageUrl = args[0]
  } else if (m.quoted && m.quoted.mtype?.includes('image')) {
    let img = await m.quoted.download?.()
    imageUrl = await uploadImage(img)
  } else if (m.mtype === 'imageMessage') {
    let img = await m.download()
    imageUrl = await uploadImage(img)
  }

  if (!imageUrl) {
    return m.reply(`Kirim gambar atau balas gambar dengan caption:\n${usedPrefix + command}`)
  }

  m.reply('⏳ Sedang memproses blur wajah...')

  try {
    let apiUrl = `https://api.siputzx.my.id/api/iloveimg/blurface?image=${encodeURIComponent(imageUrl)}`
    let { data } = await axios.get(apiUrl, { responseType: 'arraybuffer' })

    await conn.sendMessage(m.chat, {
      image: data,
      caption: '✅ Berhasil diblur wajahnya!'
    }, { quoted: m })
  } catch (e) {
    console.error(e)
    m.reply('❌ Gagal memproses gambar.')
  }
}

handler.command = ['blurface']
handler.help = ['blurface <url>', 'blurface (kirim/balas gambar)']
handler.tags = ['tools', 'ai']
handler.limit = false

export default handler