// Plugins/aiedit.js
import fs from 'fs'
import path from 'path'
import { GoogleGenerativeAI } from '@google/generative-ai'

const handler = async (m, {
  conn,
  text,
  command,
  prefix
}) => {
  const q = m.quoted ? m.quoted : m
  const mime = (q.msg || q).mimetype || ''

  if (!text) return m.reply(`Masukkan prompt custom!\n\nContoh:\n${prefix + command} buatkan foto itu lebih estetik.`)
  if (!mime) return m.reply('Silakan reply gambar dengan format jpg/png.')
  if (!/image\/(jpe?g|png)/.test(mime)) return m.reply(`Format *${mime}* tidak didukung! Hanya jpeg/jpg/png.`)

  await m.reply('Otw diedit sesuai permintaan...')

  try {
    const imgData = await q.download()
    const base64Image = imgData.toString('base64')

    const genAI = new GoogleGenerativeAI("AIzaSyB8T-3WnKqDbK3GSYYUtTiyDfIV-vBxoPw")
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp-image-generation",
      generationConfig: {
        responseModalities: ["Text", "Image"]
      }
    })

    const contents = [
      { text: text },
      {
        inlineData: {
          mimeType: mime,
          data: base64Image
        }
      }
    ]

    const response = await model.generateContent(contents)

    const parts = response?.response?.candidates?.[0]?.content?.parts
    if (!parts) return m.reply('Respons dari model tidak valid.')

    let resultImage, resultText = ''
    for (const part of parts) {
      if (part.text) resultText += part.text
      if (part.inlineData?.data) resultImage = Buffer.from(part.inlineData.data, 'base64')
    }

    if (resultImage) {
      const tmpDir = path.join(process.cwd(), 'tmp')
      if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true })

      const tempPath = path.join(tmpDir, `gemini_${Date.now()}.png`)
      fs.writeFileSync(tempPath, resultImage)

      await conn.sendMessage(m.chat, {
        image: { url: tempPath },
        caption: '*✅ Edit selesai sesuai permintaan!*'
      }, { quoted: m })

      setTimeout(() => {
        try { fs.unlinkSync(tempPath) } catch (e) { console.error('Gagal hapus file:', e) }
      }, 30_000)
    } else {
      m.reply('❌ Gagal memproses gambar.')
    }

  } catch (err) {
    console.error(err)
    m.reply(`Terjadi error:\n${err.message}`)
  }
}

handler.command = ['aiedit', 'editai']
handler.tags = ['ai', 'tools']
handler.help = ['aiedit <prompt> (balas gambar)']
handler.limit = true
handler.premium = false

export default handler