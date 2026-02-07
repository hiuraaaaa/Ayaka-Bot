import axios from 'axios'
import fs from 'fs'
import path from 'path'
import FormData from 'form-data'

let handler = async (m, { conn, usedPrefix, command }) => {
  try {
    let q = m.quoted || m
    let mime = (q.msg || q).mimetype || ''
    if (!mime.startsWith('image')) return m.reply(`Kirim atau reply gambar dengan caption ${usedPrefix + command}`)

    await m.reply(global.wait) // Tambahkan baris ini

    let tmp = './tmp'
    if (!fs.existsSync(tmp)) fs.mkdirSync(tmp)
    
    let file = path.join(tmp, `${Date.now()}.jpg`)
    let buffer = await q.download()
    fs.writeFileSync(file, buffer)
    
    let form = new FormData()
    form.append('image', fs.createReadStream(file))
    
    let { data } = await axios.post('https://www.abella.icu/removal-bg', form, { headers: form.getHeaders() })
    let url = data?.data?.previewUrl
    
    if (url) {
      await conn.sendMessage(m.chat, { image: { url }, caption: '✅ Remove Background Success' }, { quoted: m })
    } else {
      m.reply('Error')
    }
    
    fs.unlinkSync(file)
  } catch (e) {
    m.reply(e.message)
  }
}

handler.help = ['removebg', 'removebghd']
handler.command = ['removebg', 'removebghd', 'nobg']
handler.tags = ['tools', 'premium']
handler.premium = true

export default handler