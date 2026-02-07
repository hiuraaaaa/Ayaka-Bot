import fs from 'fs'
import path from 'path'

let handler = {}

handler.before = async (m, { conn }) => {
  if (!m.text || m.isBaileys || m.fromMe || !m.isGroup) return

  const file = './store-data.json'
  const groupId = m.chat

  if (!fs.existsSync(file)) return

  let data
  try {
    data = JSON.parse(fs.readFileSync(file, 'utf-8'))
  } catch (e) {
    return
  }

  const productList = data[groupId]?.msgs
  if (!productList) return

  const inputText = m.text.trim().toLowerCase()
  const matchedKey = Object.keys(productList).find(key => key.toLowerCase() === inputText)
  if (!matchedKey) return

  const stored = productList[matchedKey]

  try {
    const mediaUrl = stored.mediaUrl
    const captionText = stored.text || `Produk: *${matchedKey}*`

    if (mediaUrl) {
      const ext = path.extname(mediaUrl).toLowerCase()

      if (ext.match(/\.(jpg|jpeg|png|webp)$/)) {
        await conn.sendMessage(m.chat, { image: { url: mediaUrl }, caption: captionText }, { quoted: m })
      } else if (ext.match(/\.(mp4|mov|webm)$/)) {
        await conn.sendMessage(m.chat, { video: { url: mediaUrl }, caption: captionText }, { quoted: m })
      } else if (ext.match(/\.(pdf|docx?|xlsx?|txt|zip)$/)) {
        await conn.sendMessage(m.chat, {
          document: { url: mediaUrl },
          mimetype: 'application/octet-stream',
          fileName: matchedKey + ext,
          caption: captionText
        }, { quoted: m })
      } else {
        await conn.sendMessage(m.chat, { text: `Produk: *${matchedKey}*\nMedia tidak dikenali.` }, { quoted: m })
      }
    } else {
      await conn.sendMessage(m.chat, { text: captionText }, { quoted: m })
    }
  } catch (err) {
    await conn.sendMessage(m.chat, { text: `Gagal mengirim produk *${matchedKey}*.` }, { quoted: m })
  }

  return !0
}

export default handler