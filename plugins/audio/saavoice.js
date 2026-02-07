import axios from "axios"
import fs from "fs"
import crypto from "crypto"
import sharp from "sharp"

// === Konfigurasi file session untuk Blackbox ===
const SESSION_FILE_PATH = "./src/openaisessions.json"
const SESSION_TIMEOUT = 60 * 60 * 1000
const GEMINI_ENDPOINT = "https://us-central1-infinite-chain-295909.cloudfunctions.net/gemini-proxy-staging-v1"

if (!fs.existsSync(SESSION_FILE_PATH)) {
  fs.writeFileSync(SESSION_FILE_PATH, JSON.stringify({}, null, 2))
}

let userSessions = {}
try {
  userSessions = JSON.parse(fs.readFileSync(SESSION_FILE_PATH, "utf8"))
} catch {
  userSessions = {}
}

let userTimeouts = {}

async function geminiImageProcess(media, text) {
  let pngBuffer = await sharp(media).png().toBuffer()
  let b64 = pngBuffer.toString("base64")
  let payload = {
    model: "gemini-2.0-flash-lite",
    contents: [
      {
        parts: [
          {
            inlineData: {
              mimeType: "image/png",
              data: b64,
            },
          },
          {
            text: text || "Jelaskan isi gambar ini secara detail.",
          },
        ],
      },
    ],
  }
  let headers = {
    accept: "*/*",
    "content-type": "application/json",
    "user-agent":
      "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Mobile Safari/537.36",
  }
  let res = await axios.post(GEMINI_ENDPOINT, payload, { headers, timeout: 60000 })
  return res.data.candidates?.[0]?.content?.parts?.[0]?.text || "Tidak ada hasil dari analisis gambar."
}

async function blackbox(query, userId, media = null) {
  const id = crypto.randomBytes(8).toString("hex")
  const now = new Date()
  const wib = new Date(now.getTime() + 7 * 60 * 60 * 1000)
  const currentTime = wib.toISOString()

  const dayNames = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"]
  const monthNames = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ]
  const day = dayNames[wib.getUTCDay()]
  const date = wib.getUTCDate()
  const month = monthNames[wib.getUTCMonth()]
  const year = wib.getUTCFullYear()
  const hour = String(wib.getUTCHours()).padStart(2, "0")
  const minute = String(wib.getUTCMinutes()).padStart(2, "0")
  const second = String(wib.getUTCSeconds()).padStart(2, "0")

  const aiRole = `Sekarang nama mu *Lann4you Azkira*, AI perempuan berusia 21 tahun dari Bandung yang ceria, suportif, dan hangat.
Tanggal ${day}, ${date} ${month} ${year}, Waktu ${hour}:${minute}:${second} WIB.
Gunakan gaya bahasa santai khas Bandung seperti “atuh”, “euy”, atau “sanes”, tapi tetap sopan. Jawabanmu harus lembut, nyaman, dan rapi.`

  // === Reset sesi jika timeout ===
  if (!Array.isArray(userSessions[userId])) {
    userSessions[userId] = [{ role: "system", content: aiRole, waktu: currentTime }]
  } else if (userSessions[userId].length > 0) {
    const last = new Date(userSessions[userId].slice(-1)[0].waktu)
    if (Date.now() - last.getTime() > SESSION_TIMEOUT) {
      userSessions[userId] = [{ role: "system", content: aiRole, waktu: currentTime }]
    }
  }

  let aiResponse = ""

  try {
    // === Jika input berupa gambar ===
    if (media) {
      aiResponse = await geminiImageProcess(media, query)
    } else {
      userSessions[userId].push({ role: "user", content: query, id, waktu: currentTime })
      const sessionText = userSessions[userId]
        .map(
          (m) =>
            `${m.role === "system" ? "System" : m.role === "user" ? "User" : "Assistant"}: ${m.content}`
        )
        .join("\n")

      const payload = {
        prompt: `${aiRole}\n\nPercakapan sebelumnya:\n${sessionText}\n\nSekarang jawab pesan ini: ${query}`,
      }
      const res = await axios.post(
        "https://free-api-collection-d3hpjuk82vjq1st3tv4g.api.lp.dev/ai/gpt5",
        payload,
        { headers: { "Content-Type": "application/json" }, timeout: 60000 }
      )

      const data = res.data
      aiResponse = data?.success && data?.text ? data.text : "Lann4you lagi blank euy 😅"
    }

    userSessions[userId].push({ role: "assistant", content: aiResponse, waktu: currentTime })
    fs.writeFileSync(SESSION_FILE_PATH, JSON.stringify(userSessions, null, 2))
  } catch (e) {
    aiResponse = `Ups... error dari API: ${e.message}`
  }

  if (userTimeouts[userId]) clearTimeout(userTimeouts[userId])
  userTimeouts[userId] = setTimeout(() => {
    delete userSessions[userId]
    delete userTimeouts[userId]
    fs.writeFileSync(SESSION_FILE_PATH, JSON.stringify(userSessions, null, 2))
  }, SESSION_TIMEOUT)

  return aiResponse
}

// === Handler utama ===
let handler = async (m, { conn, args, usedPrefix, command }) => {
  let text = args.join(" ")
  let q = m.quoted ? m.quoted : m
  let mime = (q.msg || q).mimetype || ""
  let media = null

  if (/image/.test(mime)) {
    media = await q.download()
    text = text || "Jelaskan isi gambar ini."
  }

  if (!text && !media)
    return m.reply(`Contoh:\n${usedPrefix + command} Hai, kenalin aku dong 🥰\nAtau balas gambar dengan ${usedPrefix + command}`)

  await conn.sendMessage(m.chat, { react: { text: "☁️", key: m.key } })

  try {
    const reply = await blackbox(text, m.sender, media)
    const hasilAI = reply.trim().replace(/\*\*/g, "*")

    // === Generate TTS ===
    const ttsUrl = `${global.api.xterm.url}/api/text2speech/elevenlabs`
    const ttsRes = await axios.get(ttsUrl, {
      params: {
        text: hasilAI.slice(0, 300),
        key: global.api.xterm.key,
        voice: "bella",
      },
      responseType: "arraybuffer",
    })

    await conn.sendMessage(
      m.chat,
      {
        audio: ttsRes.data,
        mimetype: "audio/mp4",
        ptt: true,
      },
      { quoted: m }
    )

    await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } })
  } catch (e) {
    console.error("Error saavoice:", e)
    await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } })
    m.reply("Ups! Maaf ya, Lann4you lagi nggak bisa jawab. Coba lagi nanti atuh~ 🥺")
  }
}

handler.help = ["saavoice"]
handler.tags = ["premium"]
handler.command = /^saavoice$/i
handler.premium = true

export default handler