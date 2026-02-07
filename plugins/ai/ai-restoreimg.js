import axios from "axios"
import FormData from "form-data"
import { fileTypeFromBuffer } from "file-type"
import fakeUserAgent from "fake-useragent"

async function Uguu(content) {
  try {
    const ft = (await fileTypeFromBuffer(content)) || {}
    const formData = new FormData()
    formData.append("files[]", content, `file.${ft.ext || "bin"}`)
    const response = await axios.post("https://uguu.se/upload.php", formData, {
      headers: {
        ...formData.getHeaders(),
        "User-Agent": fakeUserAgent()
      }
    })
    if (!response.data.files?.[0]?.url) throw new Error("Invalid Uguu response")
    return response.data.files[0].url
  } catch (error) {
    throw new Error(`Failed to upload to Uguu: ${error.message}`)
  }
}

async function restoreImageByUrl(imageUrl) {
  try {
    const img = await axios.get(imageUrl, { responseType: "arraybuffer" })
    const form = new FormData()
    form.append("image", img.data, { filename: "image.jpg", contentType: "image/jpeg" })

    const res = await axios.post("https://restore.pi7.org/restore_img", form, {
      headers: {
        ...form.getHeaders(),
        "User-Agent":
          "Mozilla/5.0 (Linux; Android 13; TECNO LH7n) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Mobile Safari/537.36",
        Origin: "https://image.pi7.org",
        Referer: "https://image.pi7.org/"
      }
    })

    if (!res.data || typeof res.data !== "string")
      throw new Error("Gagal mendapatkan hasil restore.")
      
    return `https://restore.pi7.org/${res.data.replace(/^\/+/, "")}`
  } catch (err) {
    throw new Error(`Gagal restore: ${err.message}`)
  }
}

let handler = async (m, { conn, text }) => {
  try {
    let imageUrl
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ""

    if (text && /^https?:\/\//.test(text)) {

      imageUrl = text
    } else if (/image/.test(mime)) {

      const buffer = await q.download()
      imageUrl = await Uguu(buffer)
    } else {
      return m.reply(
        "📸 Kirim atau reply foto yang ingin direstore, atau berikan URL gambar.\n\nContoh:\n`.restore https://example.com/foto.jpg`"
      )
    }

    await conn.sendMessage(m.chat, {
      react: {
        text: "🎀",
        key: m.key
      }
    })
    
    const restored = await restoreImageByUrl(imageUrl)

    await conn.sendMessage(
      m.chat,
      {
        image: { url: restored },
        caption: "✅ *Foto berhasil direstore!*"
      },
      { quoted: m }
    )
  } catch (e) {
    await m.reply(`❌ Gagal memproses gambar: ${e.message}`)
  }
}

handler.command = /^(restore|clearphoto)$/i
handler.help = ["restore"]
handler.tags = ["tools","ai"]
handler.limit = 5

export default handler