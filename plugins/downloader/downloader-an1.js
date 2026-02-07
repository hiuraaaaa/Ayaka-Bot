import fetch from 'node-fetch'
import * as cheerio from 'cheerio'

const baseUrl = 'https://an1.com/'
const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'

async function an1Search(query) {
  try {
    const params = new URLSearchParams({
      story: query,
      do: 'search',
      subaction: 'search'
    })
    const url = `${baseUrl}?${params.toString()}`
    const res = await fetch(url, { headers: { 'User-Agent': userAgent } })
    const html = await res.text()
    const $ = cheerio.load(html)

    const results = []
    $('.app_list .item_app').each((i, el) => {
      const name = $(el).find('.name a span').text().trim()
      const linkDetail = $(el).find('.name a').attr('href')
      const developer = $(el).find('.developer').text().trim()
      const ratingStyle = $(el).find('.rate_star .current-rating').attr('style')
      let rating = null
      if (ratingStyle) {
        const match = ratingStyle.match(/width:(\d+)%/)
        if (match) rating = (parseInt(match[1], 10) / 20).toFixed(1)
      }
      let thumbnail = $(el).find('.img img').attr('src')
      if (thumbnail && thumbnail.startsWith('/')) {
        thumbnail = new URL(thumbnail, baseUrl).href
      }
      results.push({ name, linkDetail, developer, rating, thumbnail })
    })
    return results
  } catch (e) {
    console.error('an1Search error:', e)
    return []
  }
}

async function an1Detail(url) {
  try {
    const res = await fetch(url, { headers: { 'User-Agent': userAgent } })
    const html = await res.text()
    const $ = cheerio.load(html)

    const title = $('h1.title').first().text().trim()
    const version = $('.spec li').filter((i, el) => $(el).text().toLowerCase().includes('version')).text().replace(/Version:/i, '').trim()
    const os = $('.spec li').filter((i, el) => $(el).text().toLowerCase().includes('android')).text().trim()
    const size = $('.spec li').filter((i, el) => $(el).find('i.size').length > 0 || $(el).text().toLowerCase().includes('mb')).text().trim()
    const description = $('.description #spoiler').text().trim()
    const developer = $('.developer[itemprop="publisher"] span[itemprop="name"]').text().trim()
    const rating = $('.rate_num span[itemprop="ratingValue"]').text().trim()
    const ratingCount = $('.rate_num span[itemprop="ratingCount"]').text().trim()
    const downloadLink = $('.spec_addon a.btn-green').attr('href')
    const downloadUrl = downloadLink ? new URL(downloadLink, url).href : null
    const updated = $('.app_moreinfo_item.gplay ul.spec li time[itemprop="datePublished"]').attr('datetime') || ''
    const pAyaka = $('.app_moreinfo_item.gplay ul.spec li[itemprop="offers"] span[itemprop="pAyaka"]').text().trim()
    const installs = $('.app_moreinfo_item.gplay ul.spec li').filter((i, el) => $(el).text().toLowerCase().includes('installs')).text().replace(/Installs/i, '').trim()

    return {
      title,
      version,
      os,
      size,
      description,
      developer,
      rating,
      ratingCount,
      downloadUrl,
      updated,
      pAyaka,
      installs
    }
  } catch (e) {
    console.error('an1Detail error:', e)
    return null
  }
}

async function an1Download(url) {
  try {
    const res = await fetch(url, { headers: { 'User-Agent': userAgent } })
    const html = await res.text()
    const $ = cheerio.load(html)
    const fileName = $('h1.title.fbold').text().trim()
    const downloadLink = $('#pre_download').attr('href')
    const downloadUrl = downloadLink ? new URL(downloadLink, url).href : null

    if (!downloadUrl) throw new Error('Link download tidak ditemukan.')

    const fileRes = await fetch(downloadUrl, { headers: { 'User-Agent': userAgent } })
    const buffer = await fileRes.buffer()
    return { buffer, filename: fileName || 'file.apk' }
  } catch (e) {
    console.error('an1Download error:', e)
    return null
  }
}

let handler = async (m, { args, conn }) => {
  const subcommand = (args[0] || '').toLowerCase()
  switch (subcommand) {
    case 'search': {
      const keyword = args.slice(1).join(' ')
      if (!keyword) return m.reply('Masukkan kata kunci pencarian.\nContoh: an1 search capcut')
      m.reply('Mencari aplikasi di an1.com...')
      const results = await an1Search(keyword)
      if (!results.length) return m.reply('Tidak ditemukan aplikasi dengan kata kunci tersebut.')
      const rows = results.slice(0, 10).map(app => ({
        id: `.an1 detail ${app.linkDetail}`,
        title: app.name,
        description: `Developer: ${app.developer} | Rating: ${app.rating || 'N/A'}`,
      }))
      await conn.sendMessage(m.chat, {
        text: `Hasil pencarian untuk *${keyword}* di an1.com:`,
        footer: 'Klik untuk lihat detail aplikasi',
        buttons: [{
          buttonId: 'action',
          buttonText: { displayText: 'Pilih Aplikasi' },
          type: 4,
          nativeFlowInfo: {
            name: 'single_select',
            paramsJson: JSON.stringify({
              title: 'Daftar Aplikasi',
              sections: [{ title: 'Hasil Pencarian', rows }]
            })
          }
        }],
        headerType: 1,
        viewOnce: true
      }, { quoted: m })
      break
    }
    case 'detail': {
      const url = args[1]
      if (!url || !url.startsWith('http')) return m.reply('Link detail aplikasi tidak valid!\nContoh: an1 detail https://an1.com/7029-capcut-video-editor-apk.html')
      m.reply('Mengambil detail aplikasi, mohon tunggu sebentar...')
      const detail = await an1Detail(url)
      if (!detail) return m.reply('Gagal mengambil detail aplikasi.')

      let text = `*${detail.title}*\n\n`
      text += `Versi: ${detail.version || 'N/A'}\n`
      text += `OS: ${detail.os || 'N/A'}\n`
      text += `Ukuran: ${detail.size || 'N/A'}\n`
      text += `Developer: ${detail.developer || 'N/A'}\n`
      text += `Rating: ${detail.rating || 'N/A'} (${detail.ratingCount || '0'} reviews)\n`
      text += `Terakhir update: ${detail.updated || 'N/A'}\n`
      text += `Harga: ${detail.pAyaka || 'Gratis'}\n`
      text += `Instalasi: ${detail.installs || 'N/A'}\n\n`
      text += `Deskripsi:\n${detail.description || 'Tidak ada deskripsi.'}\n\n`
      if (detail.downloadUrl) text += `Link download: ${detail.downloadUrl}\n`

      await conn.sendMessage(m.chat, {
        text,
        footer: 'Klik tombol di bawah untuk mendapatkan file APK',
        buttons: [
          {
            buttonId: `.an1 download ${detail.downloadUrl || url}`,
            buttonText: { displayText: 'Download APK' },
            type: 1
          }
        ],
        headerType: 1
      }, { quoted: m })
      break
    }
    case 'download': {
      const url = args[1]
      if (!url || !url.startsWith('http')) return m.reply('Link halaman download tidak valid!\nContoh: an1 download https://an1.com/file_7029-dw.html')
      await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })
      const file = await an1Download(url)
      if (!file) {
        await conn.sendMessage(m.chat, { text: '❌ Gagal mengambil file APK.' }, { quoted: m })
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
        return
      }
      await conn.sendMessage(m.chat, {
        document: file.buffer,
        fileName: file.filename.endsWith('.apk') ? file.filename : file.filename + '.apk',
        mimetype: 'application/vnd.android.package-archive',
        caption: '✅ Berikut file APK-nya',
      }, { quoted: m })
      await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
      break
    }
    default:
      m.reply('Command tidak dikenali, gunakan:\n.an1 search <keyword>\n.an1 detail <url>\n.an1 download <url halaman download>')
  }
}

handler.command = /^(an1)$/i
handler.help = ['an1 search <keyword>', 'an1 detail <url>', 'an1 download <url halaman download>']
handler.tags = ['tools','downloader']
handler.limit = true
handler.register = true

export default handler