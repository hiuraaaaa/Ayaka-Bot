import fs from 'fs'
import uploadImage from '../lib/uploadImage.js'

let handler = async (m, { conn, text, command, usedPrefix }) => {
  if (!text.includes('|')) throw `Format salah!\nContoh: *${usedPrefix + command} sepatu|Ini produk sepatu terbaik*`

  const [name, ...descParts] = text.split('|')
  const contentText = descParts.join('|').trim()
  if (!name || !contentText) throw `Format tidak lengkap!\nContoh: *${usedPrefix + command} sepatu|Deskripsi produk*`

  const storeFile = './store-data.json'
  const groupId = m.chat

  let data = fs.existsSync(storeFile) ? JSON.parse(fs.readFileSync(storeFile)) : {}
  if (!data[groupId]) data[groupId] = { msgs: {} }
  if (data[groupId].msgs[name]) throw `Produk "${name}" sudah terdaftar.`

  let mediaUrl = null
  if (m.mtype && (m.mtype === 'imageMessage' || m.mtype === 'videoMessage' || m.mtype === 'stickerMessage' || m.mtype === 'documentMessage')) {
    let mediaBuffer = await m.download()
    if (!mediaBuffer) throw "Gagal mengunduh media."
    mediaUrl = await uploadImage(mediaBuffer)
    if (!mediaUrl || !mediaUrl.startsWith('https://')) throw "Gagal mengupload media."
  }

  data[groupId].msgs[name] = {
    mediaUrl,
    text: contentText
  }

  fs.writeFileSync(storeFile, JSON.stringify(data, null, 2))
  m.reply(`Berhasil menyimpan produk *${name}* ke list 🎉`)
}

handler.help = ["addlist <nama>|<isi>"]
handler.tags = ["group"]
handler.command = ["addlist"]
handler.admin = true

export default handler