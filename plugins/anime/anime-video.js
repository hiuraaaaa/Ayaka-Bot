import fetch from 'node-fetch'
import cheerio from 'cheerio'

let handler = async (m, { conn, text }) => {
  // React emoji 🍏 saat mulai proses
  await conn.sendMessage(m.chat, {
    react: {
      text: '🍏',
      key: m.key
    }
  })

  if (!text) return m.reply('Masukan Nomornya Kak\nContoh: .amv 1')
  await m.reply('Tunggu sebentar...')

  async function animeVideo() {
    const url = 'https://shortstatusvideos.com/anime-video-status-download/'
    const response = await fetch(url)
    const html = await response.text()
    const $ = cheerio.load(html)
    const videos = []
    $('a.mks_button.mks_button_small.squared').each((i, el) => {
      const href = $(el).attr('href')
      const title = $(el).closest('p').prevAll('p').find('strong').text()
      videos.push({ title, source: href })
    })
    const randomIndex = Math.floor(Math.random() * videos.length)
    return videos[randomIndex]
  }

  async function animeVideo2() {
    const url = 'https://mobstatus.com/anime-whatsapp-status-video/'
    const response = await fetch(url)
    const html = await response.text()
    const $ = cheerio.load(html)
    const videos = []
    const title = $('strong').text()
    $('a.mb-button.mb-style-glass.mb-size-tiny.mb-corners-pill.mb-text-style-heavy').each((i, el) => {
      const href = $(el).attr('href')
      videos.push({ title, source: href })
    })
    const randomIndex = Math.floor(Math.random() * videos.length)
    return videos[randomIndex]
  }

  try {
    if (text === '1') {
      const resl = await animeVideo()
      await conn.sendMessage(m.chat, { video: { url: resl.source }, caption: 'Nih Kak Videonya' }, { quoted: m })
    } else if (text === '2') {
      const resl = await animeVideo2()
      await conn.sendMessage(m.chat, { video: { url: resl.source }, caption: 'Nih Kak Videonya' }, { quoted: m })
    } else {
      await m.reply('Nomor salah! Pilih 1 atau 2.')
    }
  } catch (e) {
    console.error(e)
    await m.reply('Maaf, terjadi kesalahan saat mengambil video.')
  }
}

handler.help = ['animevideo <1|2>', 'amv <1|2>']
handler.tags = ['anime']
handler.command = /^(animevideo|amv)$/i

export default handler