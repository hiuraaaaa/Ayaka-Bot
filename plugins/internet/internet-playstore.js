import axios from 'axios'
import * as cheerio from 'cheerio'

async function PlayStore(search) {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await axios.get(`https://play.google.com/store/search?q=${search}&c=apps`)
      const hasil = []
      const $ = cheerio.load(data)
      $('.ULeU3b > .VfPpkd-WsjYwc.VfPpkd-WsjYwc-OWXEXe-INsAgc.KC1dQ.Usd1Ac.AaN0Dd.Y8RQXd > .VfPpkd-aGsRMb > .VfPpkd-EScbFb-JIbuQc.TAQqTe > a').each((i, u) => {
        const linkk = $(u).attr('href')
        const nama = $(u).find('.j2FCNc > .cXFu1 > .ubGTjb > .DdYX5').text()
        const developer = $(u).find('.j2FCNc > .cXFu1 > .ubGTjb > .wMUdtb').text()
        const img = $(u).find('.j2FCNc > img').attr('src')
        const rate = $(u).find('.j2FCNc > .cXFu1 > .ubGTjb > div').attr('aria-label')
        const rate2 = $(u).find('.j2FCNc > .cXFu1 > .ubGTjb > div > span.w2kbF').text()
        const link = `https://play.google.com${linkk}`

        hasil.push({
          link,
          nama: nama || 'No name',
          developer: developer || 'No Developer',
          img: img || 'https://i.ibb.co/G7CrCwN/404.png',
          rate: rate || 'No Rate',
          rate2: rate2 || 'No Rate',
          link_dev: `https://play.google.com/store/apps/developer?id=${developer.split(" ").join('+')}`
        })
      })
      if (!hasil.length) return resolve({ developer: '@xorizn', mess: '❌ No result found.' })
      resolve(hasil)
    } catch (err) {
      reject(err)
    }
  })
}

let handler = async (m, { conn, args, usedPrefix, command }) => {
  const text = args.join(" ")
  if (!text) return conn.reply(m.chat, `🚫 Contoh: *${usedPrefix + command} whatsapp*`, m)

  await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })

  try {
    const result = await PlayStore(text)
    if (!Array.isArray(result)) {
      return conn.reply(m.chat, result.mess || '❌ Tidak ditemukan.', m)
    }

    let teks = `📱 *Hasil Pencarian di Play Store: ${text}*\n\n`
    for (let i = 0; i < Math.min(5, result.length); i++) {
      let app = result[i]
      teks += `*${i + 1}. ${app.nama}*\n`
      teks += `🧑 Developer: ${app.developer}\n`
      teks += `⭐ Rating: ${app.rate2} (${app.rate})\n`
      teks += `🔗 [Link Aplikasi](${app.link})\n\n`
    }

    await conn.sendMessage(m.chat, {
      image: { url: result[0].img },
      caption: teks.trim()
    }, { quoted: m })
  } catch (e) {
    console.error(e)
    conn.reply(m.chat, '⚠️ Gagal mengambil data dari Play Store.', m)
  }
}

handler.help = ['playstore <query>']
handler.tags = ['internet']
handler.command = /^playstore$/i
handler.limit = true

export default handler