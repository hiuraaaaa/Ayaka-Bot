import axios from 'axios'
import * as cheerio from 'cheerio'

let handler = async (m, { conn, text }) => {
  if (!text) return conn.sendMessage(m.chat, { text: "Masukkan judul film yang ingin dicari.\nContoh: .lk21 Avengers" }, { quoted: m })

  let result = await layarKaca(text)

  if (!result.status || !result.data.film.length) {
    return conn.sendMessage(m.chat, { text: "Gagal menemukan film yang cocok." }, { quoted: m })
  }

  let timestamp = new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" })
  let caption = `Hasil Pencarian Film: "${text}"\n\nUpdate: ${timestamp}\nCreator: ${result.creator}\n\n`

  for (let i = 0; i < Math.min(result.data.film.length, 5); i++) {
    let film = result.data.film[i]
    caption += `Judul: ${film.judul}\n`
    caption += `Sutradara: ${film.sutradara || "Tidak diketahui"}\n`
    caption += `Aktor: ${film.aktor || "Tidak tersedia"}\n`
    caption += `Tonton Di: ${film.link}\n\n`
  }

  await conn.sendMessage(m.chat, {
    image: { url: result.data.film[0].thumbnail },
    caption
  }, { quoted: m })
}

handler.help = ['lk21']
handler.tags = ['internet']
handler.command = /^lk21$/i

export default handler

async function layarKaca(query) {
  try {
    let { data: html } = await axios.get(`https://tv3.lk21official.mom/search.php?s=${query}`)
    let $ = cheerio.load(html)
    let films = []

    $(".search-item").each((_, element) => {
      const title = $(element).find("h3 a").text().trim()
      const link = "https://tv3.lk21official.mom" + $(element).find("h3 a").attr("href")
      const thumbnail = "https://tv3.lk21official.mom" + $(element).find(".search-poster img").attr("src")
      const sutradara = $(element).find('p:contains("Sutradara:")').text().replace("Sutradara:", "").trim()
      const aktor = $(element).find('p:contains("Bintang:")').text().replace("Bintang:", "").trim()

      films.push({ judul: title, link, thumbnail, sutradara, aktor })
    })

    return { status: true, creator: "Lann4youOfc", data: { film: films } }
  } catch (error) {
    console.error("Error fetching movie data:", error)
    return { status: false, creator: "Lann4youOfc", data: { film: [] } }
  }
}