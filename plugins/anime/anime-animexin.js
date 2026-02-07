import fetch from 'node-fetch'
import * as cheerio from 'cheerio'

const BASE_URL = 'https://animexin.dev/'
const SEARCH_PATH = '?s='

function cleanText(text) {
  return text ? text.trim().replace(/\s+/g, ' ') : ''
}

function cleanUrl(url) {
  if (!url) return url
  let decoded
  try { decoded = decodeURIComponent(url) } catch { decoded = url }
  decoded = decoded.trim().replace(/[\r\n\t]/g, '')
  try { return encodeURI(decoded) } catch { return decoded }
}

async function animexinSearch(query) {
  const url = `${BASE_URL}${SEARCH_PATH}${encodeURIComponent(query)}`
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } })
  const html = await res.text()
  const $ = cheerio.load(html)
  const results = []
  $('.listupd article.bs').each((i, el) => {
    const title = $(el).find('.tt h2').text().trim()
    const link = $(el).find('a').attr('href')
    const img = $(el).find('img').attr('src')
    const status = $(el).find('.epx').text().trim()
    results.push({ title, link, img, status })
  })
  return results
}

async function animexinDetail(url) {
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } })
  const html = await res.text()
  const $ = cheerio.load(html)
  const infox = $('.infox').first()
  const title = $('title').text().trim().replace(/- AnimeXin$/i, '').trim()
  let status = '', network = '', studio = '', released = '', duration = '', country = '', episodes = ''
  infox.find('.info-content .spe span').each((i, el) => {
    const text = cleanText($(el).text())
    if (text.startsWith('Status:')) status = text.replace('Status:', '').trim()
    else if (text.startsWith('Network:')) network = $(el).find('a').text().trim() || text.replace('Network:', '').trim()
    else if (text.startsWith('Studio:')) studio = $(el).find('a').text().trim() || text.replace('Studio:', '').trim()
    else if (text.startsWith('Released:')) released = text.replace('Released:', '').trim()
    else if (text.startsWith('Duration:')) duration = text.replace('Duration:', '').trim()
    else if (text.startsWith('Country:')) country = $(el).find('a').text().trim() || text.replace('Country:', '').trim()
    else if (text.startsWith('Episodes:')) episodes = text.replace('Episodes:', '').trim()
  })
  const genres = []
  infox.find('.genxed a').each((i, el) => {
    const g = cleanText($(el).text())
    if (g) genres.push(g)
  })
  const episodesList = []
  $('.eplister ul li a').each((i, el) => {
    const epTitle = cleanText($(el).text())
    const epUrl = $(el).attr('href')
    if (epUrl) episodesList.push({ epTitle, epUrl })
  })
  return { title, status, network, studio, released, duration, country, episodes, genres, episodesList }
}

async function animexinDownload(url) {
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } })
  const html = await res.text()
  const $ = cheerio.load(html)
  const title =
    $('.single-info .infox h1').text().trim() ||
    $('.single-info .infox h2').text().trim() ||
    $('title').text().replace('- AnimeXin', '').trim()
  const downloads = []
  const backupDownloads = []
  $('.postbody a[href]').each((i, el) => {
    const rawLink = $(el).attr('href')
    const link = cleanUrl(rawLink)
    const label = $(el).text().trim().toLowerCase()
    if (!link) return
    if (
      label.includes('gdrive') ||
      label.includes('google drive') ||
      label.includes('terabox') ||
      label.includes('mirror') ||
      label.includes('mediafire')
    ) {
      if (!downloads.find(x => x.link === link)) {
        downloads.push({ label: $(el).text().trim(), link })
      }
    } else {
      if (!backupDownloads.find(x => x.link === link)) {
        backupDownloads.push({ label: $(el).text().trim(), link })
      }
    }
  })
  if (downloads.length === 0 && backupDownloads.length > 0) {
    for (const d of backupDownloads) {
      if (downloads.length >= 3) break
      downloads.push(d)
    }
  } else if (downloads.length < 3) {
    for (const d of backupDownloads) {
      if (downloads.length >= 3) break
      if (!downloads.find(x => x.link === d.link)) {
        downloads.push(d)
      }
    }
  }
  return { title, downloads }
}

let handler = async (m, { args, conn }) => {
  const subcommand = (args[0] || '').toLowerCase()
  switch (subcommand) {
    case 'search': {
      const keyword = args.slice(1).join(' ')
      if (!keyword) return m.reply('Masukkan judul anime!\nContoh: .animexin search one piece')
      m.reply('Mencari anime...')
      let results = await animexinSearch(keyword)
      if (!results.length) return m.reply('Anime tidak ditemukan!')
      let rows = results.slice(0, 10).map(anime => ({
        header: anime.status || 'Anime',
        title: anime.title,
        description: anime.link,
        id: `.animexin detail ${anime.link}`
      }))
      conn.sendMessage(m.chat, {
        text: `Hasil pencarian untuk *${keyword}*`,
        footer: 'Klik untuk lihat detail',
        buttons: [
          {
            buttonId: 'action',
            buttonText: { displayText: 'Pilih Anime' },
            type: 4,
            nativeFlowInfo: {
              name: 'single_select',
              paramsJson: JSON.stringify({
                title: 'Hasil Pencarian',
                sections: [
                  {
                    title: 'Daftar Anime',
                    highlight_label: 'Populer',
                    rows
                  }
                ]
              })
            }
          }
        ],
        headerType: 1,
        viewOnce: true
      }, { quoted: m })
      break
    }
    case 'detail': {
      const url = args[1]
      if (!url || !/^https?:\/\/animexin\.dev\//.test(url)) return m.reply('Link animexin tidak valid!')
      m.reply('Mengambil detail anime...')
      let data = await animexinDetail(url)
      if (!data) return m.reply('Gagal mengambil detail.')
      let teks = `*${data.title}*\n\n`
      teks += `*Status:* ${data.status}\n`
      teks += `*Network:* ${data.network}\n`
      teks += `*Studio:* ${data.studio}\n`
      teks += `*Rilis:* ${data.released}\n`
      teks += `*Durasi:* ${data.duration}\n`
      teks += `*Negara:* ${data.country}\n`
      teks += `*Jumlah Episode:* ${data.episodes}\n`
      teks += `*Genre:* ${data.genres.join(', ')}\n\n`
      teks += `*Daftar Episode:*\n`
      data.episodesList.forEach((ep, i) => {
        teks += `${i + 1}. ${ep.epTitle}\n`
      })
      let episodeRows = data.episodesList.map((ep) => ({
        id: `.animexin download ${ep.epUrl}`,
        title: ep.epTitle,
        description: ep.epUrl
      }))
      await conn.sendMessage(m.chat, {
        text: teks,
        footer: `Menampilkan semua ${data.episodesList.length} episode`,
        buttons: [
          {
            buttonId: 'action',
            buttonText: { displayText: 'Pilih Episode' },
            type: 4,
            nativeFlowInfo: {
              name: 'single_select',
              paramsJson: JSON.stringify({
                title: 'Daftar Episode',
                sections: [
                  {
                    title: 'Episode Tersedia',
                    rows: episodeRows
                  }
                ]
              })
            }
          }
        ]
      }, { quoted: m })
      break
    }
    case 'download': {
      const url = args[1]
      if (!url || !/^https?:\/\/animexin\.dev\//.test(url)) return m.reply('Link episode animexin tidak valid!')
      m.reply('Mengambil link download...')
      let data = await animexinDownload(url)
      if (!data || !data.downloads.length) return m.reply('Tidak ada link download ditemukan.')

      let mediafireLink = null
      let gdriveLink = null
      const manualLinks = []

      for (const d of data.downloads) {
        const lower = d.label.toLowerCase()
        if (!mediafireLink && lower.includes('mediafire')) {
          mediafireLink = d.link
        } else if (!gdriveLink && (lower.includes('gdrive') || lower.includes('google drive'))) {
          gdriveLink = d.link
        } else {
          manualLinks.push(d.link)
        }
      }

      const rows = []
      if (mediafireLink) rows.push({ id: `.mediafire ${mediafireLink}`, title: 'MediaFire', description: mediafireLink })
      if (gdriveLink) rows.push({ id: `.gdrive ${gdriveLink}`, title: 'Google Drive', description: gdriveLink })
      if (manualLinks.length) {
        const manualText = manualLinks.join('\n')
        rows.push({ id: `.manual ${manualLinks[0]}`, title: 'Download Manual', description: manualText })
      }

      await conn.sendMessage(m.chat, {
        text: `*${data.title}*\nPilih link download yang ingin kamu gunakan:`,
        footer: 'Pilih salah satu link download',
        buttons: [
          {
            buttonId: 'action',
            buttonText: { displayText: 'Pilih Link' },
            type: 4,
            nativeFlowInfo: {
              name: 'single_select',
              paramsJson: JSON.stringify({
                title: 'Link Download',
                sections: [
                  {
                    title: 'Download Links',
                    rows
                  }
                ]
              })
            }
          }
        ],
        headerType: 1
      }, { quoted: m })
      break
    }
    default:
      m.reply('Command tidak dikenali.\nGunakan:\n.animexin search <keyword>\n.animexin detail <url>\n.animexin download <url episode>')
  }
}

handler.command = /^(animexin)$/i
handler.help = ['animexin search <keyword>', 'animexin detail <url>', 'animexin download <url episode>']
handler.tags = ['anime']
handler.limit = true
handler.register = true

export default handler