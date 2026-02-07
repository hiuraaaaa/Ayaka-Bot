import fs from 'fs'
import uploadImage from '../lib/uploadImage.js'

let handler = async (m, { conn, text, command, usedPrefix }) => {
  if (!text.includes('|')) throw `⚠️ Format salah!\n\nContoh: *${usedPrefix + command} sepatu|Deskripsi baru produk sepatu*`

  const [name, ...descParts] = text.split('|')
  const contentText = descParts.join('|').trim()
  if (!name || !contentText) throw `❌ Format tidak lengkap!\n\nContoh: *${usedPrefix + command} sepatu|Deskripsi produk*`

  const storeFile = './store-data.json'
  const groupId = m.chat

  let data = fs.existsSync(storeFile) ? JSON.parse(fs.readFileSync(storeFile)) : {}
  if (!data[groupId] || !data[groupId].msgs[name]) throw `⚠️ Produk *${name}* belum terdaftar.`

  let mediaUrl = data[groupId].msgs[name].mediaUrl 
  if (m.mtype && (m.mtype === 'imageMessage' || m.mtype === 'videoMessage' || m.mtype === 'stickerMessage' || m.mtype === 'documentMessage')) {
    let mediaBuffer = await m.download()
    if (!mediaBuffer) throw "⚠️ Gagal mengunduh media."
    mediaUrl = await uploadImage(mediaBuffer)
    if (!mediaUrl || !mediaUrl.startsWith('https://')) throw "❌ Gagal mengupload media."
  }

  data[groupId].msgs[name] = {
    mediaUrl,
    text: contentText
  }

  fs.writeFileSync(storeFile, JSON.stringify(data, null, 2))
  m.reply(`✅ Produk *${name}* berhasil diperbarui!`)
}

handler.help = ["updatelist <nama>|<deskripsi baru>"]
handler.tags = ["group"]
handler.command = ["updatelist"]
handler.admin = true

export default handler