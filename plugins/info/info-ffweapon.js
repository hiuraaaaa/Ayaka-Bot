import axios from 'axios'
import * as cheerio from 'cheerio'

let handler = async (m, { conn }) => {
  const senjata = new SenjataFreeFire()
  const info = await senjata.Info()

  if (!info || info.length === 0) {
    await conn.reply(m.chat, 'Maaf, terjadi kesalahan saat mengambil informasi senjata Free Fire.', m)
    return
  }

  let message = `🔫 *Informasi Senjata Free Fire* 🔫\n\n`
  info.forEach((s, i) => {
    message += `*${i + 1}. ${s.name}*\n`
    message += `💥 *Damage:* ${s.damage}\n`
    message += `📜 *Deskripsi:* ${s.description}\n`
    message += `🏷️ *Tags:* ${s.tags.join(', ')}\n\n`
  })

  await conn.reply(m.chat, message.trim(), m)
}

handler.help = ['freefireweapon']
handler.tags = ['info']
handler.command = /^(freefireweapon|ffweapon|weaponsff)$/i

export default handler

class SenjataFreeFire {
  async Info() {
    try {
      const { data } = await axios.get('https://ff.garena.com/id/weapons/', {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
        }
      })
      const $ = cheerio.load(data)

      const daftarSenjata = []

      $('.weapon-card').each((_, el) => {
        const namaSenjata = $(el).find('.title-wrap span').text().trim()
        const damage = $(el).find('.damage-level').text().trim()
        const deskripsi = $(el).find('.abstract').text().trim()
        const tags = []

        $(el).find('.tags-wrap .weapon-tag').each((_, tagEl) => {
          tags.push($(tagEl).text().trim())
        })

        if (namaSenjata) {
          daftarSenjata.push({
            name: namaSenjata,
            damage,
            description: deskripsi,
            tags
          })
        }
      })

      return daftarSenjata
    } catch (error) {
      console.error("Gagal mengambil data senjata:", error.message)
      return null
    }
  }
}