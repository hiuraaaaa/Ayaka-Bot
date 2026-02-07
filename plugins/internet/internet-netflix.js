import fs from 'fs'
import fetch from 'node-fetch'
import path from 'path'

const CACHE_PATH = './tmp/netflix_cache.json'
const CACHE_DURATION = 1000 * 60 * 30

async function getNetflixTrending() {
  const religion = "/id" // bisa diubah ke "/id-en", ubah sndri ya:v
  const netflixUrl = "https://www.netflix.com" + religion

  const response = await fetch(netflixUrl)
  if (!response.ok) throw Error(`Gagal fetch: ${response.status} ${response.statusText}`)

  const html = await response.text()
  const jsonString = html.match(/reactContext = (.*?);/)?.[1]
  if (!jsonString) throw Error(`❌ Gagal menemukan data dari Netflix`)

  const cleaned = jsonString.replace(/\\x([0-9A-Fa-f]{2})/g, (_, hex) =>
    String.fromCharCode(parseInt(hex, 16)))
  const json = JSON.parse(cleaned)

  const movieAndShow = Object.entries(json.models.graphql.data).filter(v =>
    !v?.[1]?.__typename.match(/Genre|Query/))

  const result = movieAndShow.map(([_, v]) => {
    const genreList = v.coreGenres?.edges?.map(e => e.node.__ref) || []
    return {
      title: v.title,
      latestYear: v.latestYear,
      videoId: v.videoId,
      shortSynopsis: v.shortSynopsis,
      contentAdvisory: v.contentAdvisory?.certificationValue || '-',
      genre: genreList.map(ref => json.models.graphql.data[ref]?.name).join(", "),
      type: v.__typename,
      url: netflixUrl + "/title/" + v.videoId,
      poster: v['artwork({"params":{"artworkType":"BOXSHOT","dimension":{"width":200},"features":{"performNewContentCheck":false,"suppressTop10Badge":true},"format":"JPG"}})']?.url
    }
  })

  return result
}

let handler = async (m, { conn }) => {
  let cacheExists = fs.existsSync(CACHE_PATH)
  let useCache = false
  let data

  if (cacheExists) {
    let { mtimeMs } = fs.statSync(CACHE_PATH)
    if (Date.now() - mtimeMs < CACHE_DURATION) {
      data = JSON.parse(fs.readFileSync(CACHE_PATH))
      useCache = true
    }
  }

  if (!useCache) {
    try {
      data = await getNetflixTrending()
      fs.writeFileSync(CACHE_PATH, JSON.stringify(data, null, 2))
    } catch (e) {
      return m.reply(`❌ Gagal mengambil data Netflix: ${e.message}`)
    }
  }

  if (!data || data.length === 0) return m.reply('❌ Tidak ada data trending ditemukan.')

  let teks = '*📺 Netflix Trending Saat Ini:*\n\n'
  for (let i = 0; i < Math.min(data.length, 10); i++) {
    let v = data[i]
    teks += `🎬 *${v.title}* (${v.latestYear})\n`
    teks += `📌 Genre: ${v.genre}\n`
    teks += `🔞 Rating: ${v.contentAdvisory}\n`
    teks += `🗒️ Sinopsis: ${v.shortSynopsis}\n`
    teks += `🔗 ${v.url}\n\n`
  }

  await conn.sendMessage(m.chat, {
    image: { url: data[0].poster },
    caption: teks.trim()
  }, { quoted: m })
}

handler.command = /^netflix$/i
handler.help = ['netflix']
handler.tags = ['internet']
handler.register = true
handler.limit = 5

export default handler