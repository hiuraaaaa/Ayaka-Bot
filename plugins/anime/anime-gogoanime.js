import axios from 'axios'
import * as cheerio from 'cheerio'

class GogoAnime {
  static async latest() {
    const res = await axios.get('https://gogoanime.by/series/?status=&type=&order=update')
    const $ = cheerio.load(res.data)
    const result = []
    $('.listupd article.bs').each((i, el) => {
      const url = $(el).find('a').attr('href')
      const title = $(el).find('a').attr('title')
      const thumb = $(el).find('img').attr('src')
      result.push({ title, url, thumb })
    })
    return result
  }

  static async search(query) {
    const { data } = await axios.get(`https://gogoanime.by/?s=${encodeURIComponent(query)}`)
    const $ = cheerio.load(data)
    const result = []
    $('article.bs').each((i, el) => {
      const a = $(el).find('a')
      const title = a.attr('title')
      const url = a.attr('href')
      const img = a.find('img').attr('src')
      result.push({ title, url, img })
    })
    return result
  }

  static async detail(url) {
    const { data } = await axios.get(url)
    const $ = cheerio.load(data)
    const title = $('.entry-title').text().trim()
    const native = $('.alter').text().trim()
    const thumb = $('.thumb img').attr('src')
    const synopsis = $('.ninfo > p').text().trim()
    const status = $('.spe span:contains("Status:")').text().replace('Status:', '').trim()
    const studio = $('.spe span:contains("Studio:") a').text().trim()
    const type = $('.spe span:contains("Type:")').text().replace('Type:', '').trim()
    const totalEps = $('.spe span:contains("Episodes:")').text().replace('Episodes:', '').trim()
    const season = $('.spe span:contains("Season:") a').text().trim()
    const duration = $('.spe span:contains("Duration:")').text().replace('Duration:', '').trim()
    const released = $('.spe span:contains("Released:")').text().replace('Released:', '').trim()
    const genres = []
    $('.genxed a').each((_, el) => genres.push($(el).text().trim()))
    const episodes = []
    $('.episode-item a').each((_, el) => {
      const name = $(el).text().trim()
      const epUrl = $(el).attr('href')
      episodes.push({ name, url: epUrl })
    })
    return {
      title,
      native,
      thumb,
      synopsis,
      status,
      studio,
      type,
      totalEps,
      season,
      duration,
      released,
      genres,
      episodes
    }
  }
}

const handler = async (m, { conn, args, command }) => {
  try {
    if (command === 'gogonew') {
      const list = await GogoAnime.latest()
      const teks = list.slice(0, 10).map((v, i) => `${i + 1}. *${v.title}*\n${v.url}`).join('\n\n')
      await conn.sendMessage(m.chat, {
        text: `*Anime Terbaru dari GogoAnime:*\n\n${teks}`
      }, { quoted: m })

    } else if (command === 'gogosearch') {
      if (!args.length) return m.reply('Contoh: .gogosearch One Piece')
      const res = await GogoAnime.search(args.join(' '))
      if (!res.length) return m.reply('Anime tidak ditemukan.')
      const teks = res.slice(0, 10).map((v, i) => `${i + 1}. *${v.title}*\n${v.url}`).join('\n\n')
      await conn.sendMessage(m.chat, {
        text: `*Hasil Pencarian:*\n\n${teks}`
      }, { quoted: m })

    } else if (command === 'gogodetail') {
      if (!args.length) return m.reply('Contoh: .gogodetail https://gogoanime.by/category/one-piece')
      const detail = await GogoAnime.detail(args[0])
      if (detail.error) return m.reply('Gagal mengambil detail: ' + detail.error)

      const caption = `*${detail.title}* (${detail.native})

*Status:* ${detail.status}
*Type:* ${detail.type}
*Studio:* ${detail.studio}
*Total Episode:* ${detail.totalEps}
*Season:* ${detail.season}
*Duration:* ${detail.duration}
*Released:* ${detail.released}
*Genres:* ${detail.genres.join(', ')}

*Sinopsis:*
${detail.synopsis}

*Episodes:*
${detail.episodes.slice(0, 10).map(ep => `- ${ep.name}: ${ep.url}`).join('\n')}${detail.episodes.length > 10 ? '\n\nDan masih banyak lagi...' : ''}`

      await conn.sendMessage(m.chat, {
        image: { url: detail.thumb },
        caption
      }, { quoted: m })
    }

  } catch (err) {
    console.error(err)
    m.reply('Terjadi kesalahan, coba lagi nanti.')
  }
}

handler.command = ['gogonew', 'gogosearch', 'gogodetail']
handler.help = ['gogonew', 'gogosearch <query>', 'gogodetail <url>']
handler.tags = ['anime']

export default handler;