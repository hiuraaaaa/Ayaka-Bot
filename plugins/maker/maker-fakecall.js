import fetch from 'node-fetch'
import FormData from 'form-data'
import axios from 'axios'

const fkontak = {
    key: {
        participant: '0@s.whatsapp.net',
        remoteJid: '0@s.whatsapp.net',
        fromMe: false,
        id: 'Halo'
    },
    message: {
        conversation: `📞 Fake Caller`
    }
};

const handler = async (m, { conn, text, usedPrefix, command }) => {

  if (!text) {
    return conn.reply(m.chat, `Tulis nama custom lalu beri durasi!\n\nContoh:\n${usedPrefix + command} Lann4you|05:00\n\n❗(Perintah ini harus digunakan dengan me-reply sebuah gambar)`, m, { quoted: fkontak });
  }

  const [name, duration] = text.split('|').map(v => v.trim())
  if (!name || !duration) {
    return conn.reply(m.chat, `Format salah!\n\nContoh:\n${usedPrefix + command} Lann4you|05:00`, m, { quoted: fkontak });
  }

  let avatar

  const q = m.quoted ? m.quoted : m
  const mime = (q.msg || q).mimetype || ''

  if (!/image\/(jpe?g|png)/.test(mime)) {

    return conn.reply(m.chat, '❌ Anda harus mereply sebuah gambar untuk dijadikan foto profil panggilan!', m, { quoted: fkontak });
  }

  const media = await q.download()
  if (!media) {
    return conn.reply(m.chat, '❌ Gagal mengunduh gambar.', m, { quoted: fkontak });
  }

  try {
    // --- Perubahan #2 ---
    // Menambahkan pesan 'sedang memproses' dengan fkontak
    await conn.sendMessage(m.chat, { text: '⏳ Sedang membuat panggilan palsu, mohon tunggu sebentar...' }, { quoted: fkontak });

    avatar = await uploadToCatbox(media)
    if (!avatar) {
        return conn.reply(m.chat, '❌ Gagal mengunggah gambar ke server. Coba lagi nanti.', m, { quoted: fkontak });
    }

    const api = `https://api.zenzxz.my.id/maker/fakecall?nama=${encodeURIComponent(name)}&durasi=${encodeURIComponent(duration)}&avatar=${encodeURIComponent(avatar)}`

    const res = await fetch(api)
    if (!res.ok) throw await res.text()

    const buffer = await res.arrayBuffer()

    await conn.sendMessage(m.chat, {
        image: Buffer.from(buffer),
        caption: `📞 Panggilan palsu dari ${name} (${duration})`
    }, { quoted: fkontak });

  } catch (e) {
    console.error(e)
    conn.reply(m.chat, `❌ Gagal membuat panggilan palsu. Terjadi kesalahan: ${e.message}`, m, { quoted: fkontak });
  }
}

handler.help = ['fakecall Nama|Durasi (dengan reply gambar)']
handler.tags = ['maker']
handler.command = ['fakecall']
handler.limit = true
handler.group = true

export default handler

async function uploadToCatbox(buffer) {
  try {
    const form = new FormData()
    form.append('reqtype', 'fileupload')
    form.append('fileToUpload', buffer, 'image.jpg')

    const res = await axios.post('https://catbox.moe/user/api.php', form, {
      headers: form.getHeaders()
    })

    return res.data.startsWith('https://') ? res.data : null
  } catch (err) {
    console.error('Upload Catbox gagal:', err)
    return null
  }
}