import axios from 'axios'
import * as cheerio from 'cheerio'

async function KodePos(query) {
  try {
    const { data } = await axios.get('https://nomorkodepos.com/?s=' + query)
    const $ = cheerio.load(data)
    const results = []

    $('table.pure-table.pure-table-horizontal > tbody > tr').each((_, row) => {
      const columns = []
      $(row).find('td').each((_, col) => {
        columns.push($(col).text().trim())
      })
      results.push({
        province: columns[0],
        city: columns[1],
        subdistrict: columns[2],
        village: columns[3],
        postalcode: columns[4]
      })
    })

    return results
  } catch (err) {
    console.error(err)
    return []
  }
}

let handler = async (m, { args }) => {
  if (!args[0]) return m.reply('Masukkan nama daerah!\nContoh: *.kodepos Surabaya*')

  let res = await KodePos(args.join(' '))
  if (!res.length) return m.reply('❌ Data tidak ditemukan!')

  let maxResults = 50
  let limited = res.slice(0, maxResults)

  let teks = limited.map((x, i) =>
    `📍 *${i + 1}*\n🏘️ Desa: ${x.village}\n🏞️ Kecamatan: ${x.subdistrict}\n🏙️ Kota: ${x.city}\n🗺️ Provinsi: ${x.province}\n✉️ Kode Pos: *${x.postalcode}*`
  ).join('\n\n')

  if (res.length > maxResults) {
    teks += `\n\n⚠️ Menampilkan ${maxResults} dari ${res.length} hasil. Silakan persempit pencarian.`
  }

  m.reply(teks)
}

handler.command = /^kodepos$/i
handler.help = ['kodepos <nama daerah>']
handler.tags = ['tools']
handler.premium = false

export default handler