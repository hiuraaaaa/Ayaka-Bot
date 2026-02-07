import axios from 'axios'
import fetch from 'node-fetch'
import { randomUUID } from 'crypto'
import { fileTypeFromBuffer } from 'file-type'
import FormData from 'form-data'

async function Uguu(content) {
  try {
    const ft = (await fileTypeFromBuffer(content)) || {}
    const formData = new FormData()
    formData.append("files[]", content, `file.${ft.ext || "bin"}`)
    const response = await axios.post("https://uguu.se/upload.php", formData, {
      headers: { ...formData.getHeaders(), "User-Agent": "Mozilla/5.0" }
    })
    if (!response.data.files?.[0]?.url) throw new Error("Invalid Uguu response")
    return response.data.files[0].url
  } catch (error) {
    throw `❌ Gagal upload ke Uguu: ${error.message}`
  }
}

const HEADERS_BASE = {
  accept: 'application/json, text/plain, */*',
  'accept-language': 'id-ID',
  'sec-ch-ua': '"Chromium";v="127", "Not)A;Brand";v="99", "Edge";v="127"',
  'sec-ch-ua-mobile': '?1',
  'sec-ch-ua-platform': '"Android"',
  'sec-fetch-dest': 'empty',
  'sec-fetch-mode': 'cors',
  'sec-fetch-site': 'same-origin'
}

const delay = ms => new Promise(res => setTimeout(res, ms))

function generateCookie() {
  const now = Date.now()
  const rand = Math.floor(Math.random() * 1e9)
  const uid = randomUUID()
  return `anonymous_user_id=${uid}; _ga=GA1.1.${rand}.${now}; _ga_SXSGDK8NH8=GS1.1.${now}.1.0.${now}.0.0.0`
}

async function transcribeVideo(videoUrl) {
  const cookie = generateCookie()
  const HEADERS = { ...HEADERS_BASE, cookie }
  const fileName = `video-${randomUUID().slice(0, 8)}.mp4`
  const startRes = await fetch(`https://videotranscriber.ai/api/v1/transcriptions/start`, {
    method: 'POST',
    headers: {
      ...HEADERS,
      'content-type': 'application/json; charset=UTF-8',
      referer: `https://videotranscriber.ai/?utm_source=toolify`
    },
    body: JSON.stringify({
      path: videoUrl,
      type: 1,
      lang_code: '',
      diarization: false,
      accuracy: 'high',
      referrer_url: '/',
      audio_time: 140,
      file_name: fileName
    })
  })
  if (!startRes.ok) throw new Error(`Start failed: ${startRes.status}`)
  let record
  for (let i = 0; i < 60; i++) {
    const statusRes = await fetch(`https://videotranscriber.ai/api/v1/transcriptions/status?page_no=1&page_size=16`, {
      headers: { ...HEADERS, referer: `https://videotranscriber.ai/my-videos` }
    })
    if (!statusRes.ok) throw new Error(`Status failed: ${statusRes.status}`)
    const data = await statusRes.json()
    if (!data?.data?.transcription_records) {
      await delay(5000)
      continue
    }
    record = data.data.transcription_records.find(r => r.title === fileName)
    if (record && record.status === 'success') break
    if (record && record.status === 'failed') throw new Error('Transcription failed')
    await delay(5000)
  }
  if (!record) throw new Error('Timeout: Transcription not found')
  const resultRes = await fetch(`https://videotranscriber.ai/api/v1/transcriptions?record_id=${record.record_id}`, {
    headers: { ...HEADERS, referer: `https://videotranscriber.ai/my-videos` }
  })
  if (!resultRes.ok) throw new Error(`Result failed: ${resultRes.status}`)
  const result = await resultRes.json()
  return result.data
}

let handler = async (m, { conn }) => {
  const q = m.quoted ? m.quoted : m
  const mime = (q.msg || q).mimetype || ''
  if (!/video|audio/.test(mime)) throw '🎧 Kirim atau reply video/audio untuk ditranskripsi.'
  await conn.sendMessage(m.chat, { react: { text: '🎧', key: m.key } })
  const media = await q.download()
  const link = await Uguu(media)
  await conn.sendMessage(m.chat, { react: { text: '🕒', key: m.key } })
  const result = await transcribeVideo(link)
  if (!result?.transcript?.length) throw '❌ Tidak ada hasil transkripsi ditemukan.'
  const textOutput = result.transcript.map(v => `🕒 *${v.start} - ${v.end}*\n${v.text}`).join('\n\n')
  await conn.sendMessage(m.chat, { text: `🎙️ *Hasil Transkripsi:*\n\n${textOutput}` }, { quoted: m })
  await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
}

handler.help = ['transcribe (reply video/audio)']
handler.tags = ['tools', 'ai']
handler.command = /^transcribe$/i
handler.limit = true

export default handler