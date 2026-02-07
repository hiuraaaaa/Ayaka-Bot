/* 
• Plugins Animasu
• Source: https://whatsapp.com/channel/0029VakezCJDp2Q68C61RH2C
*/

import axios from 'axios'
import * as cheerio from 'cheerio'

let handler = async (m, { command, args, text }) => {
  try {
    if (command === 'animasu') {
      let res = await latest()
      if (!res.status) throw res.result
      let teks = `📺 *Anime Terbaru - Animasu*\n\n`
      res.result.slice(0, 10).forEach((anime, i) => {
        teks += `${i + 1}. *${anime.title}*\n`
        teks += `🎞️ Type: ${anime.type}\n📚 Episode: ${anime.episodes}\n🔗 ${anime.link}\n\n`
      })
      m.reply(teks.trim())
    }

    if (command === 'animasusearch') {
      if (!text) throw `Kirim salah satu kata kunci!\nContoh: .animasusearch one piece`
      let res = await search(text)
      if (!res.status || res.result.length === 0) throw '❌ Tidak ditemukan.'
      let teks = `🔎 *Hasil Pencarian: ${text}*\n\n`
      res.result.slice(0, 10).forEach((anime, i) => {
        teks += `${i + 1}. *${anime.title}*\n`
        teks += `🎞️ Type: ${anime.type}\n📚 Episode: ${anime.episodes}\n🔗 ${anime.link}\n\n`
      })
      m.reply(teks.trim())
    }

    if (command === 'animasudetail') {
      let url = args[0]
      if (!url || !url.includes('v1.animasu.top')) throw '❌ Masukkan URL valid, Dasar sensei bodoh!\n\nContoh:\n.animasudetail https://v1.animasu.top/anime/boruto-naruto-next-generations-sub-indo/'
      let res = await detail(url)
      if (!res.status) throw res.result
      let a = res.result
      let teks = `🎬 *${a.title}*\n`
      if (a.alternativeTitle) teks += `💡 ${a.alternativeTitle}\n`
      teks += `📅 Tahun: ${a.releaseYear || '-'}\n`
      teks += `🎞️ Type: ${a.type || '-'}\n`
      teks += `📚 Episode: ${a.episodes || '-'}\n`
      teks += `⏱️ Durasi: ${a.duration || '-'}\n\n`
      teks += `📝 *Deskripsi:*\n${a.description || '-'}\n\n`
      teks += `🏷️ *Genre:* ${a.genres.length ? a.genres.join(', ') : '-'}\n\n`
      if (a.episodeLinks.length) {
        teks += `🎥 *Episode:*\n`
        a.episodeLinks.slice(0, 5).forEach(ep => teks += `- ${ep.number}: ${ep.link}\n`)
        teks += '\n'
      }
      if (a.downloadLinks.length) {
        teks += `⬇️ *Download Links:*\n`
        a.downloadLinks.forEach(dl => {
          teks += `*${dl.quality}*\n`
          dl.links.forEach(x => teks += `• ${x.title}: ${x.link}\n`)
          teks += '\n'
        })
      }
      m.reply(teks.trim())
    }
  } catch (e) {
    m.reply(`${typeof e === 'string' ? e : e.message}`)
  }
}

handler.help = ['animasu', 'animasusearch <text>', 'animasudetail <link>']
handler.tags = ['anime']
handler.command = ['animasu', 'animasusearch', 'animasudetail']
handler.limit = 5

export default handler

async function latest() {
  try {
    let { data } = await axios.get('https://v1.animasu.top/')
    const $ = cheerio.load(data)
    const result = []
    $('.listupd .bs').each((_, el) => {
      result.push({
        title: $(el).find('.tt').text().trim(),
        link: $(el).find('a').attr('href'),
        type: $(el).find('.typez').text().trim(),
        episodes: $(el).find('.epx').text().trim()
      })
    })
    return { status: true, result }
  } catch (e) {
    return { status: false, result: e.message }
  }
}

async function search(query) {
  try {
    let { data } = await axios.get(`https://v1.animasu.top/?s=${encodeURIComponent(query)}`)
    const $ = cheerio.load(data)
    const result = []
    $('.listupd .bs').each((_, el) => {
      result.push({
        title: $(el).find('.tt').text().trim(),
        type: $(el).find('.typez').text().trim(),
        episodes: $(el).find('.epx').text().trim(),
        link: $(el).find('a').attr('href')
      })
    })
    return { status: true, result }
  } catch (e) {
    return { status: false, result: e.message }
  }
}

async function detail(url) {
  try {
    const { data } = await axios.get(url)
    const $ = cheerio.load(data)
    const title = $('h1[itemprop="headline"]').text().trim()
    const alt = $('.alter').text().trim()
    const description = $('.desc p').text().trim()

    const genres = []
    $('.spe span b:contains("Genre:")').parent().find('a').each((_, el) => {
      genres.push($(el).text().trim())
    })

    const releaseYear = $('.spe span:contains("Rilis:")').text().replace('Rilis:', '').trim()
    const type = $('.spe span:contains("Jenis:")').text().replace('Jenis:', '').trim()
    const episodes = $('.spe span:contains("Episode:")').text().replace('Episode:', '').trim()
    const duration = $('.spe span:contains("Durasi:")').text().replace('Durasi:', '').trim()

    const episodeLinks = []
    $('.epslist li a').each((_, el) => {
      episodeLinks.push({ number: $(el).text().trim(), link: $(el).attr('href') })
    })

    const downloadLinks = []
    $('.download li').each((_, el) => {
      const quality = $(el).find('strong').text().trim()
      const links = []
      $(el).find('a').each((_, a) => {
        links.push({ title: $(a).text().trim(), link: $(a).attr('href') })
      })
      downloadLinks.push({ quality, links })
    })

    return {
      status: true,
      result: {
        title,
        alternativeTitle: alt,
        description,
        genres,
        releaseYear,
        type,
        episodes,
        duration,
        episodeLinks,
        downloadLinks
      }
    }
  } catch (e) {
    return { status: false, result: e.message }
  }
}