import fetch from 'node-fetch'
import * as cheerio from 'cheerio'

const douyin = async (url) => {
  const apiUrl = "https://lovetik.app/api/ajaxSearch"
  const formBody = new URLSearchParams()
  formBody.append("q", url)
  formBody.append("lang", "id")

  const res = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      "Accept": "*/*",
      "X-Requested-With": "XMLHttpRequest"
    },
    body: formBody.toString()
  })

  const data = await res.json()
  if (data.status !== "ok") throw "Gagal mengambil data Douyin."

  const $ = cheerio.load(data.data)
  const title = $("h3").text()
  const thumbnail = $(".image-tik img").attr("src")
  const duration = $(".content p").text()
  const dl = []

  $(".dl-action a").each((i, el) => {
    dl.push({
      text: $(el).text().trim(),
      url: $(el).attr("href")
    })
  })

  return { title, thumbnail, duration, dl }
}

const handler = async (m, { conn, args, command }) => {
  const url = args[0]
  if (!url) throw `Contoh: .${command} https://v.douyin.com/iPHW24DE/`

  await conn.sendMessage(m.chat, { react: { text: "🎀", key: m.key } })

  try {
    const result = await douyin(url)
    const caption = `*Judul:* ${result.title}\n*Durasi:* ${result.duration}`

    const video = result.dl.find(v => /mp4/i.test(v.text))
    const audio = result.dl.find(v => /mp3/i.test(v.text))

    if (video) {
      await conn.sendMessage(m.chat, {
        video: { url: video.url },
        caption
      }, { quoted: m })
    }

    if (audio) {
      await conn.sendMessage(m.chat, {
        audio: { url: audio.url },
        mimetype: 'audio/mp4'
      }, { quoted: m })
    }

    if (!video && !audio) {
      throw 'Tidak ditemukan link video atau audio.'
    }
  } catch (e) {
    console.error(e)
    throw 'Gagal mengunduh video Douyin. Pastikan link valid.'
  }
}

handler.command = ['douyin']
handler.tags = ['downloader']
handler.help = ['douyin <url>']
handler.premium = false
handler.limit = false

export default handler