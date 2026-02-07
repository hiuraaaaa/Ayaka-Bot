import axios from 'axios'
import * as cheerio from 'cheerio'

async function snappinDownload(pinterestUrl) {
  try {
    const { csrfToken, cookies } = await getSnappinToken()

    const postRes = await axios.post(
      'https://snappin.app/',
      { url: pinterestUrl },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': csrfToken,
          Cookie: cookies,
          Referer: 'https://snappin.app',
          Origin: 'https://snappin.app',
          'User-Agent': 'Mozilla/5.0'
        }
      }
    )

    const $ = cheerio.load(postRes.data)
    const thumb = $('img').attr('src')

    const downloadLinks = $('a.button.is-success')
      .map((_, el) => $(el).attr('href'))
      .get()

    let videoUrl = null
    let imageUrl = null

    for (const link of downloadLinks) {
      const fullLink = link.startsWith('http') ? link : 'https://snappin.app' + link

      const head = await axios.head(fullLink).catch(() => null)
      const contentType = head?.headers?.['content-type'] || ''

      if (link.includes('/download-file/')) {
        if (contentType.includes('video')) {
          videoUrl = fullLink
        } else if (contentType.includes('image')) {
          imageUrl = fullLink
        }
      } else if (link.includes('/download-image/')) {
        imageUrl = fullLink
      }
    }

    return {
      status: true,
      thumb,
      video: videoUrl,
      image: videoUrl ? null : imageUrl
    }

  } catch (err) {
    return {
      status: false,
      message: err?.response?.data?.message || err.message || 'Unknown Error'
    }
  }
}

async function getSnappinToken() {
  const { headers, data } = await axios.get('https://snappin.app/')
  const cookies = headers['set-cookie'].map(c => c.split(';')[0]).join('; ')
  const $ = cheerio.load(data)
  const csrfToken = $('meta[name="csrf-token"]').attr('content')
  return { csrfToken, cookies }
}

let handler = async (m, { conn, text }) => {
  const url = text || m.quoted?.text
  if (!url || !/^https:\/\/pin\.it\/[A-Za-z0-9]+$/i.test(url)) {
    throw '❌ Masukkan link Pinterest pendek yang valid!\nContoh: https://pin.it/abcd123'
  }

  await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })

  const result = await snappinDownload(url)
  if (!result.status) {
    throw '❌ Gagal mengambil media dari Pinterest.'
  }

  const caption = `*〔 P I N T E R E S T 〕*\n\n*Url:* ${text}`
  const mediaUrl = result.video || result.image
  const mediaType = result.video ? 'video' : 'image'

  await conn.sendMessage(m.chat, {
    [mediaType]: { url: mediaUrl },
    caption
  }, { quoted: m })

  await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
}

handler.command = /^(pindl|pinterestdl)$/i
handler.help = ['pindl','pinterestdl']
handler.tags = ['downloader']
handler.limit = true
handler.premium = false

export default handler