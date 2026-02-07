import axios from 'axios'
import * as cheerio from 'cheerio'
const { proto, generateWAMessageFromContent } = (await import('@adiwajshing/baileys')).default

const BASE = 'https://www.liputan6.com'

async function getHomeNews() {
  const { data } = await axios.get(BASE)
  const $ = cheerio.load(data)
  const articles = []
  $('.articles--iridescent-list--text-item').each((_, el) => {
    const title = $(el).find('.articles--iridescent-list--text-item__title-link').text().trim()
    const href  = $(el).find('.articles--iridescent-list--text-item__title-link').attr('href')
    const link  = href.startsWith('http') ? href : BASE + href
    const summary = $(el).find('.articles--iridescent-list--text-item__summary').text().trim()
    if (title && link) articles.push({ title, link, summary, author: 'Lann4you' })
  })
  return articles
}

async function searchNews(query) {
  const { data } = await axios.get(`${BASE}/search?q=${encodeURIComponent(query)}`)
  const $ = cheerio.load(data)
  const results = []
  $('.articles--iridescent-list--text-item').each((_, el) => {
    const a     = $(el).find('.articles--iridescent-list--text-item__title-link')
    const title = a.text().trim()
    const href  = a.attr('href')
    const link  = href.startsWith('http') ? href : BASE + href
    if (title.toLowerCase().includes(query.toLowerCase())) results.push({ title, link, author: 'Lann4you' })
  })
  return results
}

async function getNewsDetail(url) {
  let html = '', page = 1, hasNext = true
  const base = url.split('?')[0]
  while (hasNext) {
    const { data } = await axios.get(page === 1 ? base : `${base}?page=${page}`)
    html += data
    const $ = cheerio.load(data)
    hasNext = !!$('.paging__link--next').length
    page++
  }
  const $ = cheerio.load(html)
  const title     = $('meta[property="og:title"]').attr('content') || $('title').text()
  const image     = $('meta[property="og:image"]').attr('content')
  const published = $('meta[property="article:published_time"]').attr('content') || $('time').text()
  const author    = $('meta[name="author"]').attr('content') || $('a[href*="/penulis/"]').text().trim()
  const content   = $('.article-content-body__item-page p').map((_, p) => $(p).text().trim()).get().filter(t => t).join('\n\n')
  return { title, image, published, author, content, scraper_by: 'Lann4you' }
}

let handler = async (m, { conn, args, text, command }) => {
  try {
    if (!command || command === 'liputannews') {
      const articles = await getHomeNews()
      if (!articles.length) return m.reply('❌ Gagal mengambil berita.')
      let txt = '📰 *Berita Utama Liputan6.com*\n\n'
      articles.slice(0,10).forEach((v,i) => {
        txt += `*${i+1}.* ${v.title}\n${v.link}\n\n`
      })
      txt += '🔍 Untuk cari: *.liputansearch <keyword>*\n🔎 Untuk detail: *.liputandetail <url>*'
      return m.reply(txt)
    }

    if (command === 'liputansearch') {
      if (!text) throw '❌ Masukkan kata kunci.\nContoh: .liputansearch teknologi'
      const results = await searchNews(text)
      if (!results.length) return m.reply('❌ Tidak ada hasil ditemukan.')
      const caption = `📚 *Pencarian:* _${text}_\n📌 Ditemukan: *${results.length}* hasil\n\n` +
                      `🔎 Klik judul untuk detail\n` +
                      `🏠 Kembali ke utama: *.liputannews*`
      const sections = [{
        title: `🔍 Hasil Pencarian`,
        rows: results.slice(0,10).map((v,i) => ({
          title: `${i+1}. ${v.title}`,
          description: 'Klik untuk lihat detail',
          id: `.liputandetail ${v.link}`
        })).concat([{
          title: '🏠 Kembali ke Berita Utama',
          description: 'Tampilkan daftar berita terbaru',
          id: `.liputannews`
        }])
      }]
      const listMessage = { title: 'Liputan6 Search', sections }
      const msg = generateWAMessageFromContent(m.chat, {
        viewOnceMessage: {
          message: {
            interactiveMessage: proto.Message.InteractiveMessage.create({
              body:   proto.Message.InteractiveMessage.Body.create({ text: caption }),
              header: proto.Message.InteractiveMessage.Header.create({ title:'', hasMediaAttachment:false }),
              nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                buttons:[{ name:'single_select', buttonParamsJson:JSON.stringify(listMessage) }]
              })
            })
          }
        }
      }, { quoted:m, contextInfo:{ mentionedJid:[m.sender] }})
      return conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
    }

    if (command === 'liputandetail') {
      const url = args[0]
      if (!url?.includes('liputan6.com')) throw '❌ URL tidak valid.'
      const detail = await getNewsDetail(url)
      let txt = `📰 *${detail.title}*\n\n` +
                `🖊️ ${detail.author} | ${detail.published}\n\n` +
                `${detail.content}\n\n` +
                `🔗 ${url}\n\n` +
                `🗞️ Sumber: Liputan6.com • Scraped by ${detail.scraper_by}`
      return conn.sendMessage(m.chat, {
        image:   { url: detail.image },
        caption: txt,
        footer:  '🏠 Kembali ke Berita Terbaru',
        buttons: [{
          buttonId: '.liputannews',
          buttonText: { displayText: '🏠 Berita Terbaru' },
          type: 1
        }],
        headerType: 4
      }, { quoted: m })
    }
  } catch (e) {
    console.error(e)
    m.reply('❌ Terjadi kesalahan saat mengambil data.')
  }
}

handler.help = ['liputannews', 'liputansearch <keyword>', 'liputandetail <url>']
handler.tags = ['internet']
handler.command = /^liputan(search|detail|news)?$/i

export default handler