import axios from 'axios'

const linkRegex = /https:\/\/open\.spotify\.com\/track\/[0-9A-Za-z]+/i

// 🎵 Fungsi Downloader Spotify
async function spotifyDown(url) {
  try {
    const response = await axios.get(`https://api.fabdl.com/spotify/get?url=${url}`)
    if (!response.data.result) {
      return {
        status: false,
        creator: 'Lann4you',
        data: 'Music Not Found :/'
      }
    }

    const { id, name, artists, image, duration_ms, gid } = response.data.result
    const curl = await axios.get(`https://api.fabdl.com/spotify/mp3-convert-task/${gid}/${id}`)
    const { download_url } = curl.data.result

    return {
      status: true,
      creator: 'Lann4you',
      nama: artists,
      title: name,
      durasi: convertDuration(duration_ms),
      thumb: image,
      url: 'https://api.fabdl.com' + download_url
    }
  } catch (error) {
    console.error(error)
    return { status: false, error: error.message }
  }
}

// 🔑 Spotify API Auth
const client_id = 'f97b33bf590840f7ab31e7d372b1a1bf'
const client_secret = 'd700cceafc7c4de483b2ec3850f97a6a'

const authOptions = {
  url: 'https://accounts.spotify.com/api/token',
  headers: {
    'Authorization': 'Basic ' + Buffer.from(`${client_id}:${client_secret}`).toString('base64'),
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  data: 'grant_type=client_credentials'
}

async function getAccessToken() {
  try {
    const response = await axios.post(authOptions.url, authOptions.data, { headers: authOptions.headers })
    if (response.status === 200) return response.data.access_token
  } catch (error) {
    console.error('Error getting token:', error)
  }
  return null
}

// 🔍 Fungsi Pencarian Spotify
async function spotifySearch(query, limit = 10, offset = 0, market = 'id') {
  const token = await getAccessToken()
  if (!token) return { status: false, data: 'Failed to get access token' }

  const searchUrl = `https://api.spotify.com/v1/search?limit=${limit}&offset=${offset}&q=${query}&type=track&market=${market}`

  try {
    const spoti = await axios.get(searchUrl, {
      headers: { Authorization: `Bearer ${token}` }
    })

    const items = spoti.data.tracks.items
    if (!items.length) return { status: false, data: `${query} tidak ditemukan` }

    const spotify = items.map(item => {
      const album = item.album
      const artis = album.artists[0]
      return {
        title: album.name,
        artis: artis.name,
        url_artis: artis.external_urls.spotify,
        rilis: album.release_date,
        populer: item.popularity + '%',
        durasi: convertDuration(item.duration_ms),
        image: album.images[1]?.url,
        preview: item.preview_url,
        urls: item.external_urls.spotify
      }
    })

    return { status: true, creator: 'Lann4you', data: spotify }
  } catch (error) {
    console.error('Error searching Spotify:', error)
    return { status: false, error: error.message }
  }
}

// ⚙️ Command Handler
let handler = async (m, { text, conn, usedPrefix, command }) => {
  try {
    switch (command) {
      // 🎶 Downloader
      case 'spotify':
      case 'spotifydl':
      case 'spotifymp3':
      case 'spotidl':
      case 'spotimp3': {
        if (!text)
          return m.reply(`Url-nya mana?\nContoh: ${usedPrefix + command} https://open.spotify.com/track/xxxxxx`)

        conn.sendMessage(m.chat, { react: { text: '👒', key: m.key } })
        if (!linkRegex.test(text))
          return m.reply(`Hanya support URL track (music)\nContoh: https://open.spotify.com/track/xxxxxx`)

        const response = await spotifyDown(text)
        if (!response.status) return m.reply('❌ Gagal mengambil data lagu.')

        const { nama, title, durasi, thumb, url } = response
        const caption = `*© 𝖲𝗉𝗈𝗍𝗂𝖿𝗒 𝖬𝗎𝗌𝗂𝖼*

*[🏷️] Info Music*
*Title:* ${title}
*Durasi:* ${durasi}
*Artis:* ${nama}
*Spotify:* ${text}

_Cari lagu lain?_
*Example:* ${usedPrefix}spotisearch <nama lagu>`

        await conn.sendMessage(m.chat, {
          text: caption,
          contextInfo: {
            mentionedJid: [m.sender],
            externalAdReply: {
              mediaType: 1,
              title,
              body: global.wm,
              thumbnailUrl: thumb,
              renderLargerThumbnail: true,
              showAdAttribution: false
            }
          }
        })
        await conn.sendFile(m.chat, url, 'spotify.mp3', '', m, null, { mimetype: 'audio/mp4' })
        break
      }

      // ▶️ Play Random dari Search
      case 'spotidyplay':
      case 'playspotify':
      case 'spotiplay':
      case 'playspoti': {
        if (!text)
          return m.reply(`Lagu apa yang ingin kamu cari?\nContoh: ${usedPrefix + command} Guitar, Loneliness and Blue Planet`)

        conn.sendMessage(m.chat, { react: { text: '🧶', key: m.key } })
        const { data } = await spotifySearch(text)
        if (!data?.length) return m.reply('❌ Lagu tidak ditemukan.')

        const song = data[Math.floor(Math.random() * data.length)]
        const getMusic = await spotifyDown(song.urls)
        if (!getMusic.status) return m.reply('❌ Gagal mengambil link audio.')

        const caps = `*© 𝖲𝗉𝗈𝗍𝗂𝖿𝗒 𝖯𝗅𝖺𝗒*

*Info Music*
*Title:* ${song.title}
*Durasi:* ${song.durasi}
*Populer:* ${song.populer}
*Rilis:* ${song.rilis}
*Link:* ${song.urls}

*Info Artis*
*Nama:* ${song.artis}
*Spotify:* ${song.url_artis}

Gunakan *${usedPrefix}spotisearch* untuk mencari lagu lainnya.`

        await conn.sendMessage(m.chat, {
          text: caps,
          contextInfo: {
            mentionedJid: [m.sender],
            externalAdReply: {
              mediaType: 1,
              title: song.title,
              body: global.wm,
              thumbnailUrl: song.image,
              renderLargerThumbnail: true,
              showAdAttribution: false
            }
          }
        })
        await conn.sendFile(m.chat, getMusic.url, 'spotify-play.mp3', '', m, null, { mimetype: 'audio/mp4' })
        break
      }

      default:
        return
    }
  } catch (error) {
    console.error(error)
    m.reply('❌ Terjadi kesalahan pada sistem.')
  }
}

handler.tags = ['downloader']
handler.help = ['spotifydl', 'spotifyplay']
handler.command = /^(spotify(download|dl|mp3)|spotidl|spotimp3|spotifyplay|playspotify|spotiplay|playspoti)$/i
handler.limit = true

export default handler

// 🕒 Konversi Durasi
function convertDuration(durationMs) {
  const seconds = Math.floor((durationMs / 1000) % 60)
  const minutes = Math.floor((durationMs / (1000 * 60)) % 60)
  const hours = Math.floor((durationMs / (1000 * 60 * 60)) % 24)

  let result = ''
  if (hours > 0) result += `${hours} jam `
  if (minutes > 0) result += `${minutes} menit `
  if (seconds > 0) result += `${seconds} detik`
  return result.trim()
}