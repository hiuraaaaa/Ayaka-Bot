import axios from 'axios'
import * as cheerio from 'cheerio'

async function getSecurityToken() {
  const { data: html } = await axios.get('https://evoig.com/', {
    headers: { 'User-Agent': 'Mozilla/5.0' }
  })

  const $ = cheerio.load(html)
  const token =
    $('script:contains("ajax_var")')
      .html()
      ?.match(/"security"\s*:\s*"([a-z0-9]{10,})"/i)?.[1] ||
    html.match(/"security"\s*:\s*"([a-z0-9]{10,})"/i)?.[1] ||
    null

  if (!token) throw new Error('Gagal mendapatkan token keamanan dari EvoIG.')
  return token
}

export async function evoig(url) {
  if (!url || !url.includes('instagram.com')) {
    throw new Error('Masukkan URL Instagram yang valid.')
  }

  const token = await getSecurityToken()
  const form = new URLSearchParams()
  form.append('action', 'ig_download')
  form.append('security', token)
  form.append('ig_url', url)

  const { data } = await axios.post('https://evoig.com/wp-admin/admin-ajax.php', form, {
    headers: {
      'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'origin': 'https://evoig.com',
      'referer': 'https://evoig.com/',
      'user-agent': 'Mozilla/5.0',
      'x-requested-with': 'XMLHttpRequest'
    }
  })

  const media = data?.data?.data
  if (!media || !Array.isArray(media) || media.length === 0) {
    throw new Error('Media tidak ditemukan, periksa kembali tautannya.')
  }

  const results = media.map(item => ({
    type: item.type,
    url: item.link
  }))

  return {
    status: true,
    count: results.length,
    data: results
  }
}

let handler = async (m, { conn, text }) => {
  if (!text) throw 'Masukkan link Instagram yang ingin diunduh!'

  await conn.sendMessage(m.chat, { react: { text: '🌛', key: m.key } })

  try {
    const res = await evoig(text)
    const caption = `✨ *Instagram Downloader*\n\n📎 *Link:* ${text}\n📁 *Total Media:* ${res.count}\n\n_Semua media berhasil diunduh dengan bantuan Ayaka. Terima kasih telah menggunakan layanan ini!_`

    for (let i = 0; i < res.data.length; i++) {
      const item = res.data[i]
      const isLast = i === res.data.length - 1

      if (item.type === 'image') {
        await conn.sendMessage(
          m.chat,
          {
            image: { url: item.url },
            caption: isLast ? caption : undefined
          },
          { quoted: m }
        )
      } else if (item.type === 'video') {
        await conn.sendMessage(
          m.chat,
          {
            video: { url: item.url },
            caption: isLast ? caption : undefined
          },
          { quoted: m }
        )
      }
    }

    await conn.sendMessage(m.chat, { react: { text: '💝', key: m.key } })
  } catch (e) {
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
    throw `Gagal mengunduh: ${e.message}`
  }
}

handler.help = ['instagram','igdl','ighd'];
handler.tags = ['downloader'];
handler.command = /^(ig|instagram|ighd|instagramhd)$/i;
handler.limit = 5;
handler.register = true;

export default handler;