import ws from 'ws'
import axios from 'axios'

let handler = async (m, { conn }) => {
  let q = m.quoted ? m.quoted : m
  let mime = (q.msg || q).mimetype || ''

  if (!mime) return m.reply('H-huh? Mana gambarnya? Jangan nyuruh aku kalau nggak ngasih apa-apa! 😤')
  if (!/image\/(jpe?g|png)/.test(mime)) return m.reply('Ini bukan gambar yang bisa kupakai, baka! Kirim yang bener dong! 💢')

  await conn.sendMessage(m.chat, {
    react: { text: '🎨', key: m.key }
  })

  try {
    const buffer = await q.download()
    const pix = new Pixnova()

    const result = await Promise.race([
      pix.img2ghibli(buffer),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Lama banget... aku capek nunggu... 😒')), 30000))
    ])

    await conn.sendMessage(m.chat, {
      react: { text: '✅', key: m.key }
    })

    await conn.sendMessage(m.chat, {
      image: { url: result },
      caption: 'J-jangan salah paham! Aku cuma lagi iseng bantuin kamu... Nih, gambarnya udah kuubah ke gaya *Ghibli*, oke? 😳✨'
    }, { quoted: m })

  } catch (e) {
    console.error('error', e)
    await conn.sendMessage(m.chat, {
      react: { text: '❌', key: m.key }
    })
    m.reply(`Ugh... gagal lagi... 😣\n${e.message}`)
  }
}

handler.help = ['toghibli']
handler.tags = ['ai','tools']
handler.command = ['toghibli','jadighibli']
handler.limit = true
handler.register = true

export default handler

class Pixnova {
  constructor() {
    this.headers = {
      'theme-version': '83EmcUoQTUv50LhNx0VrdcK8rcGexcP35FcZDcpgWsAXEyO4xqL5shCY6sFIWB2Q',
      'user-agent': 'Mozilla/5.0 (Linux; Android 10)',
      'x-code': Date.now().toString()
    }
  }

  _createSocket = async (endpoint, data) => {
    return new Promise((resolve, reject) => {
      const session_hash = Math.random().toString(36).substring(2)
      const socket = new ws(`wss://pixnova.ai/${endpoint}/queue/join`)

      socket.on('message', msg => {
        try {
          const d = JSON.parse(msg.toString('utf8'))
          if (d.msg === 'send_hash') {
            socket.send(JSON.stringify({ session_hash }))
          } else if (d.msg === 'send_data') {
            socket.send(JSON.stringify({ data }))
          } else if (d.msg === 'process_completed') {
            socket.close()
            resolve(`https://oss-global.pixnova.ai/${d.output.result[0]}`)
          }
        } catch (e) {
          socket.close()
          reject(e)
        }
      })

      socket.on('error', err => {
        socket.close()
        reject(err)
      })
    })
  }

  img2ghibli = async (buffer, {
    prompt = '(masterpiece), best quality',
    negative_prompt = '(worst quality, low quality:1.4), (greyscale, monochrome:1.1), cropped, lowres , username, blurry, trademark, watermark, title, multiple view, Reference sheet, curvy, plump, fat, strabismus, clothing cutout, side slit,worst hand, (ugly face:1.2), extra leg, extra arm, bad foot, text, name'
  } = {}) => {
    if (!buffer || !Buffer.isBuffer(buffer)) throw new Error('Gambarnya mana sih?! Kirim dulu dong! 😡')

    return this._createSocket('demo-image2image-series', {
      style_name: 'ghibli',
      source_image: `data:image/jpeg;base64,${buffer.toString('base64')}`,
      prompt,
      negative_prompt,
      request_from: 2
    })
  }
}