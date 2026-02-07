import axios from 'axios'
import FormData from 'form-data'
import translate from '@vitalets/google-translate-api'

async function uploadToCatbox(buffer) {
  const form = new FormData()
  form.append('reqtype', 'fileupload')
  form.append('fileToUpload', buffer, 'anime.jpg')

  const res = await axios.post('https://catbox.moe/user/api.php', form, {
    headers: form.getHeaders()
  })

  if (!res.data.startsWith('https://')) throw '❌ Gagal upload ke Catbox'
  return res.data
}

async function identifyAnime(imageUrl) {
  const imageBuffer = (await axios.get(imageUrl, {
    responseType: 'arraybuffer',
  })).data

  const form = new FormData()
  form.append('image', imageBuffer, {
    filename: 'anime.jpg',
    contentType: 'image/jpeg'
  })

  const res = await axios.post('https://www.animefinder.xyz/api/identify', form, {
    headers: {
      ...form.getHeaders(),
      'Origin': 'https://www.animefinder.xyz',
      'Referer': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.3 Mobile/15E148 Safari/604.1',
    },
    maxBodyLength: Infinity,
  })

  const result = res.data
  if (!result.animeTitle) throw '❌ Tidak ditemukan info anime.'

  return result
}

const handler = async (m, { conn }) => {
  const q = m.quoted ? m.quoted : m
  const mime = (q.msg || q).mimetype || ''
  if (!mime || !/image\/(jpe?g|png|webp)/.test(mime)) {
    throw '🖼️ Kirim atau reply gambar anime terlebih dahulu.'
  }

  await conn.sendMessage(m.chat, {
    react: { text: '⏳', key: m.key }
  })

  try {
    const oriBuffer = await q.download()

    const uploadedUrl = await uploadToCatbox(oriBuffer)

    const result = await identifyAnime(uploadedUrl)

    const [translatedDesc, translatedSynopsis] = await Promise.all([
      translate(result.description || '-', { to: 'id' }).then(res => res.text),
      translate(result.synopsis || '-', { to: 'id' }).then(res => res.text)
    ])

    let teks = `🎌 *Anime Finder*\n\n`
    teks += `✨ *Judul:* ${result.animeTitle || '-'}\n`
    teks += `👤 *Karakter:* ${result.character || '-'}\n`
    teks += `📅 *Tayang:* ${result.premiereDate || '-'}\n`
    teks += `🏢 *Studio:* ${result.productionHouse || '-'}\n`
    teks += `🎭 *Genre:* ${result.genres || '-'}\n\n`
    teks += `📝 *Deskripsi:*\n${translatedDesc || '-'}\n\n`
    teks += `📖 *Sinopsis:*\n${translatedSynopsis || '-'}`

    if (result.references?.length) {
      teks += `\n🔗 *Referensi:*\n` + result.references.map(v => `- ${v.site}: ${v.url}`).join('\n')
    }

    await conn.sendMessage(m.chat, {
      image: { url: uploadedUrl },
      caption: teks.trim()
    }, { quoted: m })

  } catch (err) {
    console.error('emror', err)
    throw typeof err === 'string' ? err : '❌ Terjadi kesalahan saat mengenali gambar.'
  }
}

handler.help = ["whatanime","animefinder"];
handler.tags = ["anime"];
handler.command = /^(wait|whatanime|animefinder)$/i;
handler.limit = true
export default handler;