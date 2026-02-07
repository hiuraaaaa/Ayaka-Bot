import fs from 'fs'
import path from 'path'
import axios from 'axios'
import { fileURLToPath } from 'url'
import { tmpdir } from 'os'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const handler = async (m, { conn, args, text, command }) => {
  const prompt = text || args.join(" ")
  if (!prompt) return conn.reply(m.chat, `Contoh penggunaan:\n\n.ghibligen anime cewe sedang berdiri gaya ghibli`, m)

  try {
    await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })

    const res = await axios.post("https://ghibliart.net/api/generate-image", { prompt }, {
      headers: {
        "accept": "*/*",
        "accept-language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
        "content-type": "application/json",
        "origin": "https://ghibliart.net",
        "referer": "https://ghibliart.net/",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36",
        "cookie": "_ga_DC0LTNHRKH=GS2.1.s1748942966$o1$g0$t1748942966$j60$l0$h0; _ga=GA1.1.1854864196.1748942966"
      }
    })

    const img = res.data?.image || res.data?.url
    if (!img) throw 'Gagal mendapatkan gambar dari API.'

    let buffer
    if (img.startsWith("data:image/") || img.startsWith("iVBORw")) {
      const b64 = img.replace(/^data:image\/\w+;base64,/, "")
      buffer = Buffer.from(b64, "base64")
    } else {
      const result = await axios.get(img, { responseType: 'arraybuffer' })
      buffer = result.data
    }

    const filename = `ghibli_${Date.now()}.jpg`
    const filepath = path.join(tmpdir(), filename)
    fs.writeFileSync(filepath, buffer)

    await conn.sendMessage(m.chat, {
      image: fs.readFileSync(filepath),
      caption: `🎨 Ghibli Art Generator\n\n🖋️ Prompt:\n${prompt}`
    }, { quoted: m })

    fs.unlinkSync(filepath)

    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
  } catch (e) {
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
    conn.reply(m.chat, `Terjadi kesalahan: ${e.message || e}`, m)
  }
}

handler.command = /^ghibligen$/i
handler.help = ["ghibligen <prompt>"]
handler.tags = ["ai"]
handler.limit = 5
handler.register = true

export default handler