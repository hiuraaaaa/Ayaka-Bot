import axios from 'axios'
import uploadImage from '../lib/uploadImage.js'
const { proto, generateWAMessageFromContent } = (await import('@adiwajshing/baileys')).default

const FILTERS = ['Coklat', 'Hitam', 'Nerd', 'Piggy', 'Carbon', 'Botak']

global.waifuhitamCache = global.waifuhitamCache || {}

async function Hytamkan(imageUrl, filter = 'Hitam') {
  const selected = FILTERS.find(f => f.toLowerCase() === filter.toLowerCase())
  if (!selected) throw `❌ Filter '${filter}' tidak tersedia.`

  const imgRes = await axios.get(imageUrl, { responseType: 'arraybuffer' })
  const base64Input = Buffer.from(imgRes.data).toString('base64')

  const res = await axios.post('https://wpw.my.id/api/process-image', {
    imageData: base64Input,
    filter: selected.toLowerCase()
  }, {
    headers: {
      'Content-Type': 'application/json',
      'Origin': 'https://wpw.my.id',
      'Referer': 'https://wpw.my.id/',
    }
  })

  const dataUrl = res.data?.processedImageUrl
  if (!dataUrl?.startsWith('data:image/')) throw '❌ Gagal memproses gambar'

  return Buffer.from(dataUrl.split(',')[1], 'base64')
}

let handler = async (m, { conn, args, command }) => {
  const sender = m.sender

  if (command === 'hytamkan') {

    const q = m.quoted ? m.quoted : m
    const mime = (q.msg || q).mimetype || ''

    if (!/image\/(jpe?g|png|gif)/.test(mime)) {
      return m.reply('📸 Kirim atau reply gambar terlebih dahulu!')
    }

    const media = await q.download()
    const imageUrl = await uploadImage(media)
    global.waifuhitamCache[sender] = imageUrl

    const caption = `🎨 *WAIFU HITAM MAKER*\n\n📸 Gambar sudah disimpan.\n📲 Silakan pilih filter dari daftar di bawah ini.`

    const sections = [{
      title: '🖤 Pilih Filter Penghitaman',
      rows: FILTERS.map(filter => ({
        title: `🧪 ${filter}`,
        description: `Klik untuk menggunakan filter ${filter}`,
        id: `.waifuhitamfilter ${filter}`
      }))
    }]

    const listMessage = {
      title: '🎛️ Filter List',
      sections
    }

    const msg = generateWAMessageFromContent(m.chat, {
      viewOnceMessage: {
        message: {
          interactiveMessage: proto.Message.InteractiveMessage.create({
            body: proto.Message.InteractiveMessage.Body.create({ text: caption }),
            header: proto.Message.InteractiveMessage.Header.create({ title: '', hasMediaAttachment: false }),
            nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
              buttons: [{
                name: 'single_select',
                buttonParamsJson: JSON.stringify(listMessage)
              }]
            })
          })
        }
      }
    }, {
      quoted: m,
      contextInfo: {
        mentionedJid: [m.sender]
      }
    })

    return conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
  }

  if (command === 'waifuhitamfilter') {
    const filter = args[0]?.toLowerCase()
    if (!FILTERS.map(f => f.toLowerCase()).includes(filter)) {
      return m.reply(`❌ Filter tidak dikenali.\nGunakan salah satu: ${FILTERS.join(', ')}`)
    }

    const imageUrl = global.waifuhitamCache[sender]
    if (!imageUrl) {
      return m.reply('📸 Tidak ada gambar yang disimpan.\nSilakan kirim atau reply gambar lalu ketik .waifuhitam')
    }

    await conn.sendMessage(m.chat, { react: { text: '🎀', key: m.key } })

    try {
      const result = await Hytamkan(imageUrl, filter)
      delete global.waifuhitamCache[sender]

      await conn.sendMessage(m.chat, {
        image: result,
        caption: `🖤 Filter: ${filter}`
      }, { quoted: m })

    } catch (e) {
      return m.reply(`❌ Error:\n${e}`)
    }
  }
}

handler.help = ['hytamkan', 'waifuhitamfilter'];
handler.tags = ['tools', 'anime'];
handler.command = /^(hytamkan|waifuhitamfilter)$/i;
handler.register = true;
handler.limit = true;

export default handler;