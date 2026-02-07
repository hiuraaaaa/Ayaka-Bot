import fetch from 'node-fetch'
import * as cheerio from 'cheerio'
import CryptoJS from 'crypto-js'

const allInOneDownloader = {
  getToken: async function () {
    const req = await fetch("https://allinonedownloader.com/")
    if (!req.ok) return null
    const res = await req.text()
    const $ = cheerio.load(res)
    const token = $("#token").val()
    const url = $("#scc").val()
    const cookie = req.headers.get('set-cookie')
    return { token, url, cookie }
  },

  generateHash: function (url, token) {
    const key = CryptoJS.enc.Hex.parse(token)
    const iv = CryptoJS.enc.Hex.parse('afc4e290725a3bf0ac4d3ff826c43c10')
    const encrypted = CryptoJS.AES.encrypt(url, key, {
      iv,
      padding: CryptoJS.pad.ZeroPadding
    })
    return encrypted.toString()
  },

  download: async function (url) {
    const conf = await allInOneDownloader.getToken()
    if (!conf) return { error: "❌ Gagal mendapatkan token dari web.", result: {} }

    const { token, url: path, cookie } = conf
    const hash = allInOneDownloader.generateHash(url, token)

    const data = new URLSearchParams()
    data.append('url', url)
    data.append('token', token)
    data.append('urlhash', hash)

    const req = await fetch(`https://allinonedownloader.com${path}`, {
      method: "POST",
      headers: {
        "Accept": "*/*",
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "Cookie": `crs_ALLINONEDOWNLOADER_COM=blah; ${cookie}`,
        "Referer": "https://allinonedownloader.com/",
        "User-Agent": "Mozilla/5.0",
        "X-Requested-With": "XMLHttpRequest"
      },
      body: data
    })

    if (!req.ok) return { error: "❌ Terjadi kesalahan saat request", result: {} }

    try {
      const json = await req.json()
      return {
        input_url: url,
        source: json.source,
        result: {
          title: json.title,
          duration: json.duration,
          thumbnail: json.thumbnail,
          downloadUrls: json.links
        },
        error: null
      }
    } catch (e) {
      return { error: "❌ Gagal parsing JSON", result: {} }
    }
  }
}

let handler = async (m, { conn, text, command, usedPrefix }) => {
  if (!text) return conn.sendMessage(m.chat, {
    text: `📥 *Contoh penggunaan:*\n\n${usedPrefix + command} https://vt.tiktok.com/ZSk8xwsaM/\n\nFitur ini support link:\nTwitter Video Downloader | Instagram Video Downloader | Facebook Video Downloader | Tumblr Video Downloader | Vimeo Video Downloader | Dailymotion Video Downloader | TED Video Downloader | Tiktok Video Downloader | Imgur Video Downloader | Instagram Reels Downloader | Instagram Story Downloader | Pinterest Video Downloader.`
  }, { quoted: m })

  await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })

  try {
    const res = await allInOneDownloader.download(text)
    if (res.error) {
      await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
      return conn.sendMessage(m.chat, { text: res.error }, { quoted: m })
    }

    const { title, duration, downloadUrls } = res.result
    const caption = `\`A L L - D O W N L O A D\`\n\n🎬 *${title || 'Tanpa Judul'}*\n⏱️ Durasi: ${duration || '-'}\n🌐 Sumber: ${res.source}`

    const video = downloadUrls.find(v => v.type === 'mp4' || /\.mp4$/i.test(v.url))
    if (video?.url) {
      await conn.sendMessage(m.chat, {
        video: { url: video.url },
        caption
      }, { quoted: m })
      await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
      return
    }

    const images = downloadUrls.filter(v =>
      ['jpg', 'jpeg', 'png', 'webp'].includes(v.type?.toLowerCase()) ||
      /\.(jpg|jpeg|png|webp)$/i.test(v.url)
    )

    if (images.length > 0) {
      const imgList = images.map(v => ({
        image: { url: v.url },
        caption: images.indexOf(v) === 0 ? caption : undefined
      }))
      for (const img of imgList) {
        await conn.sendMessage(m.chat, img, { quoted: m })
      }
      await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
      return
    }

    await conn.sendMessage(m.chat, { react: { text: '⚠️', key: m.key } })
    await conn.sendMessage(m.chat, {
      text: '❌ Tidak ditemukan media video atau gambar yang dapat dikirim.'
    }, { quoted: m })

  } catch (err) {
    console.error(err)
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
    await conn.sendMessage(m.chat, {
      text: '❌ Terjadi kesalahan saat memproses permintaan.'
    }, { quoted: m })
  }
}

handler.help = ['allinone <link>']
handler.tags = ['downloader']
handler.command = /^allinone$/i

export default handler