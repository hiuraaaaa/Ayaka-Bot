import axios from "axios"
import FormData from "form-data"
import fs from "fs"
import sharp from "sharp"

const dbPath = "./src/antinsfw.json"
if (!fs.existsSync(dbPath)) fs.writeFileSync(dbPath, JSON.stringify({}, null, 2))

function loadDB() {
  return JSON.parse(fs.readFileSync(dbPath, "utf8"))
}

async function nyckelCheck(filePath) {
  try {
    const form = new FormData()
    form.append("file", fs.createReadStream(filePath))

    const res = await axios.post(
      "https://www.nyckel.com/v1/functions/o2f0jzcdyut2qxhu/invoke",
      form,
      {
        headers: {
          ...form.getHeaders(),
          accept: "application/json, text/javascript, */*; q=0.01",
          origin: "https://www.nyckel.com",
          referer: "https://www.nyckel.com/pretrained-classifiers/nsfw-identifier/",
          "user-agent":
            "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Mobile Safari/537.36",
          "x-requested-with": "XMLHttpRequest",
        },
      }
    )

    return res.data
  } catch (err) {
    console.error("❌ Nyckel Error:", err.response?.data || err.message)
    return null
  }
}

export async function before(m, { isAdmin, isBotAdmin }) {
  if (m.isBaileys && m.fromMe) return !0
  if (!m.isGroup) return !1

  const db = loadDB()
  const data = db[m.chat]

  if (!data?.active) return !1
  if (isAdmin || !isBotAdmin) return !1

  if (["imageMessage", "stickerMessage"].includes(m.mtype)) {
    try {
      const buffer = await m.download()
      const tmp = `./tmp/${Date.now()}`
      const final = `${tmp}.jpg`

      if (m.mtype === "stickerMessage") {
        await sharp(buffer).jpeg().toFile(final)
      } else {
        fs.writeFileSync(final, buffer)
      }

      const result = await nyckelCheck(final)
      fs.unlinkSync(final)

      if (result && result.labelName === "Porn" && result.confidence > 0.7) {
        const confidence = (result.confidence * 100).toFixed(1)
        await m.reply(`${data.caption}\n\n• Label: *${result.labelName}*\n• Keyakinan: *${confidence}%*`)

        return this.sendMessage(m.chat, {
          delete: {
            remoteJid: m.chat,
            fromMe: false,
            id: m.key.id,
            participant: m.key.participant,
          },
        })
      }
    } catch (e) {
      console.error("❌ AntiNSFW Detect Error:", e.message)
    }
  }

  return !1
}