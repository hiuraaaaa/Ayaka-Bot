import axios from 'axios'
import * as cheerio from 'cheerio'

async function Jadwal_Sepakbola() {
  try {
    const { data } = await axios.get('https://www.jadwaltv.net/jadwal-sepakbola')
    const $ = cheerio.load(data)
    let tv = []

    $('table.table.table-bordered > tbody > tr.jklIv').each((_, i) => {
      let an = $(i).html().replace(/<td>/g, '').replace(/<\/td>/g, ' - ')
      tv.push(`${an.substring(0, an.length - 3)}`)
    })

    if (!tv.length || tv.every(x => x === undefined)) {
      return { developer: '@Lann4you', mess: 'No result found' }
    }

    return tv
  } catch (err) {
    return { error: true, message: 'Gagal mengambil jadwal sepakbola.' }
  }
}

let handler = async (m, { conn }) => {
  await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })
  const jadwal = await Jadwal_Sepakbola()

  if (Array.isArray(jadwal)) {
    let pesan = '📺 *Jadwal Sepakbola Hari Ini:*\n\n'
    pesan += jadwal.map((x, i) => `${i + 1}. ${x}`).join('\n')
    await conn.sendMessage(m.chat, { text: pesan }, { quoted: m })
  } else if (jadwal.error) {
    await conn.sendMessage(m.chat, { text: `❌ Error: ${jadwal.message}` }, { quoted: m })
  } else {
    await conn.sendMessage(m.chat, { text: `⚠️ Info: ${jadwal.mess || 'Tidak ada jadwal.'}` }, { quoted: m })
  }
}
handler.command = /^(jadwalbola|jadwalsoccer)$/i
handler.help = ['jadwalbola']
handler.tags = ['info','internet']
handler.limit = 5;

export default handler