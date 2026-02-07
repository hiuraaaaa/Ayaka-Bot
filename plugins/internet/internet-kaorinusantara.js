import axios from 'axios'
import * as cheerio from 'cheerio'
const { proto, generateWAMessageFromContent } = (await import('@adiwajshing/baileys')).default

const BASE_URL = 'https://www.kaorinusantara.or.id'

async function getNewBerita() {
  const res = await axios.get(BASE_URL)
  const $ = cheerio.load(res.data)
  const hasil = []

  $('.td_module_10').each((i, el) => {
    const title = $(el).find('.entry-title a').text().trim()
    const url = $(el).find('.entry-title a').attr('href')
    const thumb = $(el).find('img').attr('data-img-url') || $(el).find('img').attr('src')
    const date = $(el).find('.td-post-date').text().trim()
    if (title && url) hasil.push({ title, url, thumb, date })
  })

  return hasil
}

async function searchBerita(query) {
  const res = await axios.get(`${BASE_URL}/?s=${encodeURIComponent(query)}`)
  const $ = cheerio.load(res.data)
  const hasil = []

  $('.td_module_10').each((i, el) => {
    const title = $(el).find('.entry-title a').text().trim()
    const url = $(el).find('.entry-title a').attr('href')
    const thumb = $(el).find('img').attr('data-img-url') || $(el).find('img').attr('src')
    const date = $(el).find('.td-post-date').text().trim()
    if (title && url) hasil.push({ title, url, thumb, date })
  })

  return hasil
}

async function getDetail(url) {
  if (!url.includes(BASE_URL)) throw '❌ URL bukan dari kaorinusantara.or.id'

  const res = await axios.get(url)
  const $ = cheerio.load(res.data)

  const title = $('h1.entry-title').text().trim()
  const thumb = $('.td-post-featured-image img').attr('src')
  const date = $('.td-post-date time').text().trim()

  const content = []
  const images = []

  $('.td-post-content p').each((i, el) => {
    const txt = $(el).text().trim()
    if (txt) content.push(txt)

    const img = $(el).find('img').attr('src')
    if (img) images.push(img)
  })

  return {
    title,
    thumb,
    date,
    content: content.join('\n\n'),
    image: thumb || images[0]
  }
}

let handler = async (m, { conn, command, args, text }) => {
  try {
    if (command === 'kaorinews') {
      let res = await getNewBerita()
      if (!res.length) return m.reply('❌ Tidak ada berita ditemukan.')
      let teks = `📰 *Berita Terbaru - Kaori Nusantara*\n\n`
      teks += res.slice(0, 5).map((v, i) => `*${i + 1}.* [${v.title}](${v.url})\n📅 ${v.date}`).join('\n\n')
      return m.reply(teks)
    }

    if (command === 'kaorisearch') {
      if (!text) return m.reply('🔍 Ketik: *.kaorisearch <keyword>*')
      let res = await searchBerita(text)
      if (!res.length) return m.reply('❌ Tidak ditemukan hasil pencarian.')

      const msgList = res.slice(0, 10).map(v => `.kaoridetail ${v.url}`)

      const sections = [{
        title: "📦 Hasil Pencarian",
        rows: res.slice(0, 10).map((v, i) => ({
          title: `📰 ${v.title}`,
          description: v.date,
          id: `.kaoridetail ${v.url}`
        }))
      }]

      const listMessage = {
        title: `📚 Hasil untuk: ${text}`,
        sections
      }

      const msg = generateWAMessageFromContent(m.chat, {
        viewOnceMessage: {
          message: {
            interactiveMessage: proto.Message.InteractiveMessage.create({
              body: proto.Message.InteractiveMessage.Body.create({ text: '🔎 Pilih salah satu berita di bawah ini untuk melihat detailnya.' }),
              header: proto.Message.InteractiveMessage.Header.create({ title: "", hasMediaAttachment: false }),
              nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                buttons: [{
                  name: "single_select",
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

      return await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })

    }

    if (command === 'kaoridetail') {
      if (!args[0]) return m.reply('📄 Ketik: *.kaoridetail <url_berita>*')
      let res = await getDetail(args[0])

      let caption = `📰 *${res.title}*\n📅 ${res.date}\n\n${res.content.slice(0, 300)}...\n\n📖 Selengkapnya klik tombol di bawah.`

      await conn.sendMessage(m.chat, {
        image: { url: res.image },
        caption,
        footer: 'Kaori Nusantara',
        buttons: [
          {
            buttonId: '.kaorinews', 
            buttonText: { displayText: '🌐 Baca Berita Baru' },
            type: 1
          }
        ],
        headerType: 4
      }, { quoted: m })
    }
  } catch (e) {
    console.error(e)
    m.reply('❌ Gagal mengambil data. Coba lagi nanti.')
  }
}

handler.help = ['kaorinews', 'kaorisearch <query>', 'kaoridetail <url>']
handler.tags = ['internet']
handler.command = ['kaorinews', 'kaorisearch', 'kaoridetail']

export default handler