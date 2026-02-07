import axios from 'axios'
import FormData from 'form-data'

async function uploadUguu(buffer, filename = 'image.jpg') {
  const form = new FormData()
  form.append('files[]', buffer, { filename })

  const res = await axios.post('https://uguu.se/upload.php', form, {
    headers: form.getHeaders()
  })

  if (res.data.files && res.data.files[0]?.url) {
    return res.data.files[0].url
  } else {
    throw new Error('❌ Upload ke Uguu gagal.')
  }
}

async function generateBabyFace({ gender = 'girl', imageUrl1, imageUrl2 }) {
  if (!imageUrl1 || !imageUrl2) throw '📸 Kedua URL gambar wajib diisi!'
  if (!['girl', 'boy'].includes(gender)) throw '🚻 Gender hanya "girl" atau "boy".'

  const body = { gender, image: imageUrl1, image2: imageUrl2 }

  const res = await axios.post(
    'https://storyviewer.ai/api/v1/baby-mystic/generate',
    body,
    {
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://storyviewer.ai',
        'Referer': 'https://storyviewer.ai/ai-baby-face-generator',
        'User-Agent': 'Mozilla/5.0 (Android) Chrome Mobile Safari',
        'Accept': '*/*'
      },
      responseType: 'text',
      timeout: 90000
    }
  )

  const lines = res.data.trim().split('\n').reverse()
  const lastLine = lines.find(line => line.includes('"output"'))
  const jsonMatch = lastLine?.match(/data:\s*(\{.*\})/)
  const parsed = jsonMatch ? JSON.parse(jsonMatch[1]) : null

  if (!parsed?.output) throw '💔 Gagal mendapatkan hasil bayi.'
  return parsed.output
}

if (!global.conn.session) global.conn.session = {}
if (!global.conn.session.babyface) global.conn.session.babyface = {}

function getSession(sender) {
  if (!global.conn.session.babyface[sender]) global.conn.session.babyface[sender] = {}
  return global.conn.session.babyface[sender]
}

let handler = async (m, { conn, command, args }) => {
  const sender = m.sender
  const q = m.quoted || m
  const mime = (q.msg || q)?.mimetype || ''
  const session = getSession(sender)

  if (/^settarget$/i.test(command)) {
    if (!mime.startsWith('image/')) return m.reply('📷 Kirim atau balas gambar target-nya dulu, senpai~')
    const buffer = await q.download()
    const url = await uploadUguu(buffer)
    session.image1 = url
    return m.reply('✅ Foto pertama disimpan~\nKirim foto kedua lalu ketik *.setsource*')
  }

  if (/^setsource$/i.test(command)) {
    if (!mime.startsWith('image/')) return m.reply('📷 Kirim atau balas gambar pasangan-nya dulu yaa~')
    const buffer = await q.download()
    const url = await uploadUguu(buffer)
    session.image2 = url
    return m.reply('✅ Foto kedua disimpan~\nSekarang ketik *.babyface girl* atau *.babyface boy*')
  }

  if (/^babyface$/i.test(command)) {
    const gender = (args[0] || 'girl').toLowerCase()

    if (!session.image1 || !session.image2) {
      return m.reply(`📥 Belum lengkap, senpai~!\nGunakan:\n• *.settarget* (foto 1)\n• *.setsource* (foto 2)`)
    }

    if (!['girl', 'boy'].includes(gender)) {
      return m.reply('❌ Gender hanya "girl" atau "boy", yaa~')
    }

    await conn.sendMessage(m.chat, { react: { text: '👶', key: m.key } })

    try {
      const result = await generateBabyFace({
        gender,
        imageUrl1: session.image1,
        imageUrl2: session.image2
      })

      await conn.sendMessage(m.chat, {
        image: { url: result },
        caption: `👶✨ *Bayinya sudah jadi, senpai~!*`
      }, { quoted: m })

    } catch (e) {
      await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
      m.reply(`💔 Gagal generate wajah bayi.\n\n📛 *Detail:* ${e.message || e}`)
    }
  }
}

handler.help = ['settarget', 'setsource', 'babyface [girl|boy]']
handler.tags = ['ai']
handler.command = /^settarget|setsource|babyface$/i
handler.limit = true

export default handler