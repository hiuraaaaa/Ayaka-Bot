import axios from 'axios'
import cheerio from 'cheerio'
import { Sticker } from 'wa-sticker-formatter'

const baseUrl = 'https://getstickerpack.com'

async function searchSticker(query) {
  const res = await axios.get(`${baseUrl}/stickers?query=${encodeURIComponent(query)}`)
  const $ = cheerio.load(res.data)
  const packs = []

  $('.sticker-pack-cols a').each((_, el) => {
    const title = $(el).find('.title').text().trim()
    const href = $(el).attr('href')?.trim()
    if (title && href) {
      const fullUrl = href.startsWith('http') ? href : baseUrl + href
      packs.push({ title, url: fullUrl })
    }
  })

  return packs
}

async function getStickers(packUrl) {
  const res = await axios.get(packUrl)
  const $ = cheerio.load(res.data)
  const links = []

  $('img.sticker-image').each((_, el) => {
    const src = $(el).attr('data-src-large')
    if (src) links.push(src)
  })

  return links
}

let handler = async (m, { conn, text }) => {
  if (!text) return m.reply('🔍 Contoh penggunaan:\n.stickersearch gura')

  const packs = await searchSticker(text)
  if (!packs.length) return m.reply('❌ Tidak ada sticker pack ditemukan.')

  const selectedPack = packs[0]
  m.reply(`📦 Mengambil semua stiker dari *${selectedPack.title}*...\n${selectedPack.url}`)

  const stickers = await getStickers(selectedPack.url)
  if (!stickers.length) return m.reply('❌ Tidak ada stiker ditemukan.')

  for (let url of stickers) {
    try {
      const sticker = new Sticker(url, {
        pack: selectedPack.title,
        author: 'Lann4you',
        type: 'full',
        quality: 80
      })
      const buffer = await sticker.toBuffer()
      await conn.sendMessage(m.chat, { sticker: buffer }, { quoted: m })
      await delay(1000) 
    } catch (e) {
      console.error(`❌ Gagal kirim sticker: ${url}`)
    }
  }
}
handler.command = ['stickerpack','stickersearch']
handler.tags = ['sticker']
handler.help = ['stickersearch <query>']
handler.register = true

export default handler

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}