import axios from 'axios'
const { proto, generateWAMessageFromContent } = (await import('@adiwajshing/baileys')).default

async function ssweb(url = '', full = false, type = 'desktop') {
  type = type.toLowerCase()
  if (!['desktop', 'tablet', 'phone'].includes(type)) type = 'desktop'

  const form = new URLSearchParams()
  form.append('url', url)
  form.append('device', type)
  if (full) form.append('full', 'on')
  form.append('cacheLimit', 0)

  const res = await axios({
    url: 'https://www.screenshotmachine.com/capture.php',
    method: 'post',
    data: form
  })

  const cookies = res.headers['set-cookie']
  const buffer = await axios({
    url: 'https://www.screenshotmachine.com/' + res.data.link,
    headers: {
      'cookie': cookies.join('')
    },
    responseType: 'arraybuffer'
  })

  return Buffer.from(buffer.data)
}

const deviceOptions = [
  { id: 'desktop', title: '🖥 Desktop', description: 'Screenshot area terlihat (desktop)' },
  { id: 'tablet', title: '📱 Tablet', description: 'Screenshot area terlihat (tablet)' },
  { id: 'phone', title: '📲 Phone', description: 'Screenshot area terlihat (phone)' },
  { id: 'desktop-full', title: '🖥 Full Desktop', description: 'Full page screenshot desktop' },
  { id: 'tablet-full', title: '📱 Full Tablet', description: 'Full page screenshot tablet' },
  { id: 'phone-full', title: '📲 Full Phone', description: 'Full page screenshot phone' },
]

let handler = async (m, { conn, args, command }) => {
  if (command === 'ssweb') {
    const url = args[0]
    if (!url || !/^https?:\/\//.test(url)) {
      await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
      return m.reply(`❌ Contoh penggunaan:\n\n.ssweb https://example.com`)
    }

    const caption = `🌐 *SSWEB TOOL*\n\n🔗 URL: ${url}\n\n📲 Pilih jenis screenshot yang ingin kamu ambil:`

    const sections = [{
      title: '📱 Pilih Device Mode',
      rows: deviceOptions.map(opt => ({
        title: opt.title,
        description: opt.description,
        id: `.sswebdev ${opt.id} ${url}`
      }))
    }]

    const listMessage = {
      title: '🖼️ Screenshot Pilihan Device',
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

    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
    return
  }

  if (command === 'sswebdev') {
    let device = args[0]
    const url = args[1]
    if (!url || !device) {
      await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
      return m.reply('❌ Format salah.')
    }

    let full = false
    if (device.endsWith('-full')) {
      full = true
      device = device.replace('-full', '')
    }

    try {
      await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })
      const img = await ssweb(url, full, device)

      const caption = `✅ *Screenshot Selesai!*\n\n🌐 *URL:* ${url}\n💻 *Mode:* ${device.toUpperCase()}\n📄 *Tampilan:* ${full ? 'Full Page' : 'Visible Area'}`

      await conn.sendMessage(m.chat, {
        image: img,
        caption
      }, { quoted: m })

      await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
    } catch (e) {
      console.error(e)
      await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
      return m.reply('❌ Gagal mengambil screenshot. Pastikan URL bisa diakses publik.')
    }
  }
}

handler.help = ['ssweb <url>', 'sswebdev']
handler.tags = ['internet', 'tools']
handler.command = ['ssweb', 'sswebdev']
handler.limit = 5

export default handler